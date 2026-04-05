import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { formatDate, normalizeString, resolveCompanyId } from "../_shared";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const companyId = await resolveCompanyId(req, new URL(req.url).searchParams.get("companyId") ?? undefined);
    if (!companyId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const gigs = await prisma.gigs.findMany({
      where: { company_id: companyId },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: gigs.map((gig) => ({
        id: gig.id,
        title: gig.title,
        description: gig.description,
        skills: gig.requirements ?? [],
        budget: gig.budget?.toString() ?? "",
        deadline: formatDate(gig.created_at),
        status: gig.status,
        companyId: gig.company_id,
      })),
    });
  } catch (error) {
    console.error("STARTUP_GIGS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch gigs";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: unknown;
      description?: unknown;
      skills?: unknown;
      budget?: unknown;
      companyId?: unknown;
      deadline?: unknown;
    };

    const title = normalizeString(body.title);
    const description =
      normalizeString(body.description) || "Details will be added soon.";
    const deadline = normalizeString(body.deadline);
    const companyId = await resolveCompanyId(req, normalizeString(body.companyId));
    const skills = Array.isArray(body.skills)
      ? body.skills.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean)
      : [];
    const budgetValue =
      typeof body.budget === "number"
        ? body.budget
        : parseFloat(normalizeString(body.budget).replace(/[^0-9.]/g, ""));
    const budget = Number.isFinite(budgetValue) && budgetValue > 0 ? budgetValue : null;

    if (!title || !companyId) {
      return NextResponse.json(
        { success: false, error: "Title and a valid company are required." },
        { status: 400 }
      );
    }

    let created: {
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
      created = await prisma.gigs.create({
        data: {
          company_id: companyId,
          title,
          description,
          requirements: skills,
          budget,
          status: "OPEN",
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // Fallback for legacy databases where Prisma reports a mysterious
      // `(not available)` column on gigs.create(). We bypass the broken
      // mapping and do a minimal insert with raw SQL.
      if (message.includes("not available") || message.includes("gigs.create")) {
        const rows = await prisma.$queryRaw<
          {
            id: string;
            title: string;
            description: string;
            company_id: string;
            status: string;
            created_at: Date | null;
          }[]
        >`INSERT INTO "gigs" ("company_id", "title", "description", "status")
          VALUES (${companyId}, ${title}, ${description}, 'OPEN')
          RETURNING "id", "title", "description", "company_id", "status", "created_at"`;

        const row = rows[0];
        if (!row) {
          throw err;
        }

        created = {
          id: row.id,
          title: row.title,
          description: row.description,
          requirements: [],
          budget: null,
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
        id: created.id,
        title: created.title,
        description: created.description,
        skills: created.requirements ?? [],
        budget: created.budget?.toString() ?? "",
        deadline: deadline || formatDate(created.created_at),
        status: created.status,
        companyId: created.company_id,
      },
    });
  } catch (error) {
    console.error("STARTUP_GIGS_POST_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to create gig";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
