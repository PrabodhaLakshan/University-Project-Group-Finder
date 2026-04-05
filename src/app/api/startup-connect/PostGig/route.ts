import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { formatDate } from "../_shared";

export const runtime = "nodejs";

type PostGigBody = {
  title?: unknown;
  description?: unknown;
  skills?: unknown;
  budget?: unknown;
  companyId?: unknown;
  deadline?: unknown;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toBudgetValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PostGigBody;
    const title = asTrimmedString(body.title);
    const description =
      asTrimmedString(body.description) || "Details will be added soon.";
    const budget = toBudgetValue(body.budget);
    const deadline = asTrimmedString(body.deadline);
    const companyIdFromBody = asTrimmedString(body.companyId);
    const skills = Array.isArray(body.skills)
      ? body.skills
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required." },
        { status: 400 }
      );
    }

    let companyId = companyIdFromBody || "";
    const authHeader = request.headers.get("authorization") || undefined;
    const payload = verifyToken(authHeader);

    // If token is present, prefer owner's company to avoid bad localStorage IDs.
    if (payload?.userId) {
      const ownedCompany = await prisma.companies.findFirst({
        where: { owner_id: payload.userId },
        orderBy: { created_at: "desc" },
        select: { id: true },
      });
      if (ownedCompany?.id) {
        companyId = ownedCompany.id;
      }
    }

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Valid companyId is required." },
        { status: 400 }
      );
    }

    const company = await prisma.companies.findUnique({
      where: { id: companyId },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found for this gig." },
        { status: 404 }
      );
    }

    const newGig = await prisma.gigs.create({
      data: {
        title,
        description,
        requirements: skills,
        budget,
        company_id: companyId,
        status: "OPEN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Gig published successfully!",
      data: {
        id: newGig.id,
        title: newGig.title,
        description: newGig.description,
        skills: newGig.requirements,
        budget: newGig.budget?.toString() ?? "",
        deadline: deadline || formatDate(newGig.created_at),
        companyId: newGig.company_id,
        status: newGig.status,
      },
    });
  } catch (error) {
    console.error("POST_GIG_ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to publish gig";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "PostGig API is working" });
}