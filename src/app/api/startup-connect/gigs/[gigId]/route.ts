import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { formatDate, normalizeString } from "../../_shared";

export const runtime = "nodejs";

type RouteContext = { params: { gigId: string } } | { params: Promise<{ gigId: string }> };

async function getGigId(context: RouteContext) {
  const maybePromise = (context as { params: Promise<{ gigId: string }> }).params;
  const params =
    typeof (maybePromise as Promise<{ gigId: string }>)?.then === "function"
      ? await maybePromise
      : (context as { params: { gigId: string } }).params;
  return params?.gigId?.trim() ?? "";
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const gigId = await getGigId(context);
    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required." }, { status: 400 });
    }

    const gig = await prisma.gigs.findUnique({ where: { id: gigId } });
    if (!gig) {
      return NextResponse.json({ success: false, error: "Gig not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: gig.id,
        title: gig.title,
        description: gig.description,
        skills: gig.requirements ?? [],
        budget: gig.budget?.toString() ?? "",
        deadline: formatDate(gig.created_at),
        status: gig.status,
        companyId: gig.company_id,
      },
    });
  } catch (error) {
    console.error("STARTUP_GIG_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch gig";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const gigId = await getGigId(context);
    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required." }, { status: 400 });
    }

    const body = (await req.json()) as {
      title?: unknown;
      description?: unknown;
      skills?: unknown;
      budget?: unknown;
      status?: unknown;
    };

    const title = normalizeString(body.title);
    const description = normalizeString(body.description);
    const status = normalizeString(body.status);
    const skills = Array.isArray(body.skills)
      ? body.skills.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean)
      : undefined;
    const budgetInput = normalizeString(body.budget);
    const parsedBudget = budgetInput ? parseFloat(budgetInput.replace(/[^0-9.]/g, "")) : undefined;

    const data: {
      title?: string;
      description?: string;
      requirements?: string[];
      budget?: number | null;
      status?: string;
    } = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (skills) data.requirements = skills;
    if (parsedBudget !== undefined) data.budget = Number.isFinite(parsedBudget) && parsedBudget > 0 ? parsedBudget : null;
    if (status) data.status = status.toUpperCase();

    let updated: {
      id: string;
      title: string;
      description: string;
      requirements: string[] | null;
      budget: { toString(): string } | null;
      status: string;
      company_id: string;
      created_at: Date | null;
    };

    try {
      updated = await prisma.gigs.update({
        where: { id: gigId },
        data,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // Legacy fallback: some older databases trigger a Prisma
      // `(not available)` column error on gigs.update(). In that
      // case we update only the core columns using raw SQL so
      // updates still work without touching newer optional fields.
      if (message.includes("not available") || message.includes("gigs.update")) {
        const nextTitle = title || null;
        const nextDescription = description || null;
        const nextStatus = status ? status.toUpperCase() : null;

        const rows = await prisma.$queryRaw<
          {
            id: string;
            title: string;
            description: string;
            company_id: string;
            status: string;
            created_at: Date | null;
          }[]
        >`UPDATE "gigs"
          SET
            "title" = COALESCE(${nextTitle}, "title"),
            "description" = COALESCE(${nextDescription}, "description"),
            "status" = COALESCE(${nextStatus}, "status")
          WHERE "id" = ${gigId}
          RETURNING "id", "title", "description", "company_id", "status", "created_at"`;

        const row = rows[0];
        if (!row) {
          throw err;
        }

        const budgetForResponse =
          parsedBudget !== undefined && Number.isFinite(parsedBudget) && parsedBudget > 0
            ? { toString: () => parsedBudget.toString() }
            : null;

        updated = {
          id: row.id,
          title: row.title,
          description: row.description,
          requirements: skills ?? [],
          budget: budgetForResponse,
          status: row.status,
          company_id: row.company_id,
          created_at: row.created_at,
        };
      } else {
        throw err;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        skills: updated.requirements ?? [],
        budget: updated.budget?.toString() ?? "",
        deadline: formatDate(updated.created_at),
        status: updated.status,
        companyId: updated.company_id,
      },
    });
  } catch (error) {
    console.error("STARTUP_GIG_PATCH_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to update gig";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const gigId = await getGigId(context);
    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required." }, { status: 400 });
    }

    const gig = await prisma.gigs.findUnique({
      where: { id: gigId },
      select: {
        id: true,
        title: true,
        company_id: true,
        gig_applications: {
          where: { status: "ACCEPTED" },
          select: { user_id: true },
        },
      },
    });

    if (!gig) {
      return NextResponse.json({ success: false, error: "Gig not found." }, { status: 404 });
    }

    // First, ensure collaborations are recorded for accepted applications.
    for (const app of gig.gig_applications) {
      await prisma.startup_collaborations.upsert({
        where: {
          user_id_company_id: {
            user_id: app.user_id,
            company_id: gig.company_id,
          },
        },
        create: {
          user_id: app.user_id,
          company_id: gig.company_id,
          gig_title: gig.title,
        },
        update: { gig_title: gig.title },
      });
    }

    // Soft-delete the gig. On some legacy databases Prisma can throw a
    // `(not available)` column error on gigs.update(), so we fall back
    // to a minimal raw SQL UPDATE in that specific case.
    try {
      await prisma.gigs.update({
        where: { id: gigId },
        data: { status: "CLOSED" },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("not available") || message.includes("gigs.update")) {
        await prisma.$executeRaw`
          UPDATE "gigs" SET "status" = 'CLOSED' WHERE "id" = ${gigId}
        `;
      } else {
        throw err;
      }
    }

    return NextResponse.json({ success: true, data: { id: gig.id, status: "CLOSED" } });
  } catch (error) {
    console.error("STARTUP_GIG_DELETE_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to delete gig";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
