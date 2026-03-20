import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

// Reject payment and cancel order
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "") as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sellerId = decoded.userId;
    const body = await request.json();
    const { orderId, reason } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get order with product details
    const order = await prisma.uniMartOrder.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: { seller: true },
        },
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify that the current user is the seller of this product
    if (order.product.sellerId !== sellerId) {
      return NextResponse.json(
        { error: "You are not authorized to reject this order" },
        { status: 403 }
      );
    }

    // Check if order is in PENDING status
    if (order.paymentStatus !== "PENDING") {
      return NextResponse.json(
        { error: `Order is already ${order.paymentStatus.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Update order status to REJECTED
    await prisma.uniMartOrder.update({
      where: { id: orderId },
      data: { paymentStatus: "REJECTED" },
    });

    // Update product status back to AVAILABLE and clear currentOrderId
    await prisma.uniMartProducts.update({
      where: { id: order.productId },
      data: { 
        status: "AVAILABLE",
        currentOrderId: null,
      },
    });

    // Create notification for buyer - order rejected
    await createNotification({
      userId: order.buyerId,
      title: "Payment Rejected ❌",
      message: `Your payment for "${order.product.title}" was rejected.${reason ? ` Reason: ${reason}` : " Please contact the seller."}`,
      type: "ORDER_REJECTED",
      orderId: order.id,
    });

    return NextResponse.json(
      {
        message: "Order rejected successfully. Product is now available again.",
        order: {
          id: order.id,
          paymentStatus: "REJECTED",
          product: {
            id: order.product.id,
            title: order.product.title,
            status: "AVAILABLE",
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment rejection error:", error);
    return NextResponse.json(
      { error: "Failed to reject payment" },
      { status: 500 }
    );
  }
}
