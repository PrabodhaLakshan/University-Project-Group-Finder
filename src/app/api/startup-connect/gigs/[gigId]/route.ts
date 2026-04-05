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

    const updated = await prisma.gigs.update({
      where: { id: gigId },
      data,
    });

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

    await prisma.$transaction(async (tx) => {
      for (const app of gig.gig_applications) {
        await tx.startup_collaborations.upsert({
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
      await tx.gigs.delete({ where: { id: gigId } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("STARTUP_GIG_DELETE_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to delete gig";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
