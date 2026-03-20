import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

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

    const buyerId = decoded.userId;

    // Parse form data
    const formData = await request.formData();
    const productId = formData.get("productId") as string;
    const receiptFile = formData.get("receipt") as File;

    if (!productId || !receiptFile) {
      return NextResponse.json(
        { error: "Missing required fields (productId, receipt)" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!receiptFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Receipt must be an image file" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (receiptFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Get product and verify it's available
    const product = await prisma.uniMartProducts.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Product is no longer available" },
        { status: 400 }
      );
    }

    if (product.sellerId === buyerId) {
      return NextResponse.json(
        { error: "You cannot buy your own product" },
        { status: 400 }
      );
    }

    // Convert file to base64 for storage
    const bytes = await receiptFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const receiptDataUrl = `data:${receiptFile.type};base64,${base64}`;

    // Create order with bank deposit
    const order = await prisma.uniMartOrder.create({
      data: {
        productId,
        buyerId,
        paymentMethod: "BANK",
        paymentStatus: "PENDING",
        receiptUrl: receiptDataUrl,
      },
      include: {
        product: {
          include: { seller: true },
        },
        buyer: true,
      },
    });

    // Update product status to RESERVED and link to this order
    await prisma.uniMartProducts.update({
      where: { id: productId },
      data: { 
        status: "RESERVED",
        currentOrderId: order.id 
      },
    });

    // Create notification for seller - new order placed
    await createNotification({
      userId: order.product.sellerId,
      title: "New Order Received 🛒",
      message: `You received a new order for "${order.product.title}"`,
      type: "ORDER_PLACED",
      orderId: order.id,
    });

    // Create notification for seller - payment uploaded
    await createNotification({
      userId: order.product.sellerId,
      title: "Payment Uploaded 📸",
      message: `Buyer has uploaded payment receipt for "${order.product.title}"`,
      type: "PAYMENT_UPLOADED",
      orderId: order.id,
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          id: order.id,
          productId: order.productId,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          product: {
            title: order.product.title,
            price: order.product.price,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bank deposit order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
