import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { hasGigCompletionApproval } from "../_completion";

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

    const rowsWithApproval = await Promise.all(
      rows.map(async (row) => {
        const approved = await hasGigCompletionApproval(payload.userId, row.company_id);

        const hasReview = reviewedCompanies.has(row.company_id);
        const isCompletionApproved = Boolean(approved);

        return {
          row,
          hasReview,
          isCompletionApproved,
          canReview: isCompletionApproved && !hasReview,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: rowsWithApproval.map(({ row, hasReview, isCompletionApproved, canReview }) => ({
        id: row.id,
        companyId: row.company_id,
        companyName: row.companies.name,
        logoUrl: row.companies.logo_url,
        gigTitle: row.gig_title,
        hasReview,
        isCompletionApproved,
        canReview,
        collaboratedAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error("STARTUP_COLLABORATIONS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load collaborations";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
