import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

// Get single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "");
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.uniMartOrder.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        buyer: {
          select: { id: true, name: true, email: true, student_id: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Handle null relations due to RLS policies
    let seller: { id: string; name: string; email: string } | null = order.product?.seller || null;
    if (order.product && !seller) {
      try {
        seller = await prisma.users.findUnique({
          where: { id: order.product.sellerId },
          select: { id: true, name: true, email: true },
        });
      } catch (e) {
        console.warn("Could not fetch seller:", e);
      }
    }

    const safeOrder = {
      ...order,
      product: order.product ? {
        ...order.product,
        seller: seller || { id: "", name: "Unknown Seller", email: "" },
      } : null,
      buyer: order.buyer || { id: "", name: "Anonymous", email: "", student_id: "" },
    };

    return NextResponse.json(safeOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "");
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { paymentStatus } = body;

    if (!paymentStatus || !["PENDING", "PAID", "VERIFIED"].includes(paymentStatus)) {
      return NextResponse.json(
        { error: "Invalid payment status" },
        { status: 400 }
      );
    }

    // Get order to verify it exists
    const order = await prisma.uniMartOrder.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.uniMartOrder.update({
      where: { id },
      data: { paymentStatus },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        buyer: {
          select: { id: true, name: true, email: true, student_id: true },
        },
      },
    });

    // If payment is verified or paid, mark product as SOLD
    if (paymentStatus !== "PENDING") {
      await prisma.uniMartProducts.update({
        where: { id: order.productId },
        data: { status: "SOLD" },
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// Delete order (cancel order)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "");
    
    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.uniMartOrder.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Only allow cancellation if order is still PENDING
    if (order.paymentStatus !== "PENDING") {
      return NextResponse.json(
        { error: "Cannot cancel a completed order" },
        { status: 400 }
      );
    }

    // Delete order
    await prisma.uniMartOrder.delete({
      where: { id },
    });

    // Revert product status to AVAILABLE
    await prisma.uniMartProducts.update({
      where: { id: order.productId },
      data: { status: "AVAILABLE" },
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
