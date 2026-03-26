import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

// Verify payment and mark order as VERIFIED, product as SOLD
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
    const { orderId } = body;

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
        { error: "You are not authorized to verify this order" },
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

    // Update order status to VERIFIED
    await prisma.uniMartOrder.update({
      where: { id: orderId },
      data: { paymentStatus: "VERIFIED" },
    });

    // Update product status to SOLD and clear currentOrderId
    await prisma.uniMartProducts.update({
      where: { id: order.productId },
      data: { 
        status: "SOLD",
        currentOrderId: null, // Clear the reservation
      },
    });

    // Create notification for buyer - payment verified
    await createNotification({
      userId: order.buyerId,
      title: "Payment Verified ✅",
      message: `Your payment for "${order.product.title}" has been verified. Order completed!`,
      type: "PAYMENT_VERIFIED",
      orderId: order.id,
    });

    // Create notification for seller - item sold
    await createNotification({
      userId: order.product.sellerId,
      title: "Item Sold 💰",
      message: `"${order.product.title}" has been sold successfully!`,
      type: "ITEM_SOLD",
      orderId: order.id,
    });

    return NextResponse.json(
      {
        message: "Payment verified successfully. Product marked as sold.",
        order: {
          id: order.id,
          paymentStatus: "VERIFIED",
          product: {
            id: order.product.id,
            title: order.product.title,
            status: "SOLD",
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
