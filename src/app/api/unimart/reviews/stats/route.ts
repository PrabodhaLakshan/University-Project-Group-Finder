import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

/**
 * GET /api/unimart/reviews/stats?productId=...
 * 
 * Returns comprehensive review statistics for a product:
 * - Average rating
 * - Total review count
 * - Rating breakdown (1-5 stars with counts)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // Get all reviews for the product
    const reviews = await prisma.uniMartReview.findMany({
      where: { productId },
      select: { rating: true, id: true },
    });

    // Calculate aggregate stats
    const totalReviews = reviews.length;
    
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    // Create breakdown by star rating
    const breakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      breakdown[review.rating as keyof typeof breakdown]++;
    });

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      breakdown,
    });
  } catch (error) {
    console.error("GET /api/unimart/reviews/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review statistics" },
      { status: 500 }
    );
  }
}
