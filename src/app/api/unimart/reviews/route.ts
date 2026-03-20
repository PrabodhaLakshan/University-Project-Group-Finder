import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

/**
 * SETUP REQUIRED:
 * After schema.prisma is updated with Review model, run these commands:
 *   npx prisma generate
 *   npx prisma migrate dev --name add_review_system
 * 
 * This will generate Prisma types and sync the database.
 */

// GET reviews for a product
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

    const reviews = await prisma.uniMartReview.findMany({
      where: { productId },
      include: {
        buyer: {
          select: { id: true, name: true, student_id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average rating
    const average = reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

    // Handle null buyer relations due to RLS policies
    const safeReviews = reviews.map((r: any) => ({
      ...r,
      buyer: r.buyer || { id: "", name: "Anonymous Reviewer", student_id: "" },
    }));

    return NextResponse.json({
      reviews: safeReviews,
      average: Math.round(average * 10) / 10,
      count: reviews.length,
    });
  } catch (error) {
    console.error("GET /api/unimart/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST create a review
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "") as any;

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, orderId, rating, comment } = body;

    // Validate input
    if (!productId || !orderId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: "Comment must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Verify order exists, belongs to buyer, and is VERIFIED
    const order = await prisma.uniMartOrder.findFirst({
      where: {
        id: orderId,
        buyerId: decoded.userId,
        paymentStatus: "VERIFIED",
        productId,
      },
      include: {
        product: {
          include: { seller: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "You cannot review this product. Order must be verified first." },
        { status: 403 }
      );
    }

    // Check if review already exists for this order
    const existingReview = await prisma.uniMartReview.findUnique({
      where: { orderId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    // Create review
    const review = await prisma.uniMartReview.create({
      data: {
        productId,
        buyerId: decoded.userId,
        orderId,
        rating,
        comment,
      },
      include: {
        buyer: {
          select: { id: true, name: true, student_id: true },
        },
      },
    });

    // Send notification to seller
    await createNotification({
      userId: order.product.sellerId,
      title: "New Review Received ⭐",
      message: `A buyer left a ${rating}-star review on "${order.product.title}"`,
      type: "ORDER_PLACED", // Reusing existing type
      orderId,
      link: `/modules/uni-mart/products/${productId}`,
    });

    // Handle null buyer relation due to RLS policies
    const safeReview = {
      ...review,
      buyer: review.buyer || { id: "", name: "Anonymous Reviewer", student_id: "" },
    };

    return NextResponse.json(safeReview, { status: 201 });
  } catch (error) {
    console.error("POST /api/unimart/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
