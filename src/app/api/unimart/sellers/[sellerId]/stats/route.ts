import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

/**
 * GET /api/unimart/sellers/[sellerId]/stats
 * 
 * Returns seller rating statistics:
 * - Average rating across all their products' reviews
 * - Total number of reviews
 * - Total products sold
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerId: string }> | { sellerId: string } }
) {
  try {
    // Handle both async and sync params (Next.js version compatibility)
    const resolvedParams = 'then' in params ? await params : params;
    const sellerId = resolvedParams.sellerId;

    console.log(`[Seller Stats API] Received request for sellerId: ${sellerId}`);

    if (!sellerId || typeof sellerId !== "string") {
      console.error(`[Seller Stats API] Invalid sellerId: ${sellerId}`);
      return NextResponse.json(
        { error: "sellerId is required and must be a string" },
        { status: 400 }
      );
    }

    console.log(`Fetching stats for seller: ${sellerId}`);

    // Get all reviews for products sold by this seller
    const reviews = await prisma.uniMartReview.findMany({
      where: {
        product: {
          sellerId: sellerId,
        },
      },
      select: {
        rating: true,
        id: true,
      },
    });

    console.log(`Found ${reviews.length} reviews for seller ${sellerId}`);

    // Get total products by seller
    const productCount = await prisma.uniMartProducts.count({
      where: { sellerId },
    });

    console.log(`Seller has ${productCount} total products`);

    // Get sold products count
    const soldCount = await prisma.uniMartProducts.count({
      where: {
        sellerId,
        status: "SOLD",
      },
    });

    console.log(`Seller has ${soldCount} sold products`);

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const response = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      totalProducts: productCount,
      soldProducts: soldCount,
    };

    console.log(`Returning stats:`, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/unimart/sellers/[sellerId]/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller statistics", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
