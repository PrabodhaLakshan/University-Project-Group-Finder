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

    // Parse request body
    const body = await request.json();
    const { productId, cardholderName, email, phone } = body;

    if (!productId || !cardholderName || !email || !phone) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (productId, cardholderName, email, phone)",
        },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate phone (at least 10 digits)
    if (!/^\d{10,}$/.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number" },
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

    // Create order with pending card payment
    const order = await prisma.uniMartOrder.create({
      data: {
        productId,
        buyerId,
        paymentMethod: "CARD",
        paymentStatus: "PENDING",
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
      message: `A buyer has placed a card payment order for "${order.product.title}"`,
      type: "ORDER_PLACED",
      orderId: order.id,
    });

    // In a real implementation, you would:
    // 1. Call Stripe API to create a checkout session
    // 2. Return the checkout URL
    // For now, we'll return a placeholder checkout URL
    // In production, integrate with Stripe:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({...});
    // const checkoutUrl = session.url;

    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/stripe-checkout?orderId=${order.id}`;

    return NextResponse.json(
      {
        message: "Card payment order created",
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
        checkoutUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Card payment order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
