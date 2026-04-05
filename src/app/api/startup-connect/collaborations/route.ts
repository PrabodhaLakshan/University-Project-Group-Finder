import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Companies the signed-in student has collaborated with (ACCEPTED hired, or gig removed after hire).
 * Used to submit reviews after the gig post is deleted — same rows power company_reviews → StartupReviews.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const payload = verifyToken(authHeader);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Sign in required." }, { status: 401 });
    }

    const rows = await prisma.startup_collaborations.findMany({
      where: { user_id: payload.userId },
      include: {
        companies: { select: { id: true, name: true, logo_url: true } },
      },
      orderBy: { created_at: "desc" },
    });

    const reviews = await prisma.company_reviews.findMany({
      where: { user_id: payload.userId },
      select: { company_id: true },
    });
    const reviewedCompanies = new Set(reviews.map((r) => r.company_id));

    return NextResponse.json({
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        companyId: r.company_id,
        companyName: r.companies.name,
        logoUrl: r.companies.logo_url,
        gigTitle: r.gig_title,
        hasReview: reviewedCompanies.has(r.company_id),
        collaboratedAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error("STARTUP_COLLABORATIONS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load collaborations";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
