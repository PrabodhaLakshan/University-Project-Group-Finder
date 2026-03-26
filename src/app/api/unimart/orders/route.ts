import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

// Get current user's orders
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "") as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const buyerId = decoded.userId;

    // Fetch all orders for this buyer
    const orders = await prisma.uniMartOrder.findMany({
      where: { buyerId },
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
      orderBy: { createdAt: "desc" },
    });

    // Handle null relations due to RLS policies
    const safeOrders = await Promise.all(
      orders.map(async (order: any) => {
        let seller = order.product?.seller;
        
        // If seller is null, try to fetch it separately
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
        
        return {
          ...order,
          product: order.product ? {
            ...order.product,
            seller: seller || { id: "", name: "Unknown Seller", email: "" },
          } : null,
          buyer: order.buyer || { id: "", name: "Anonymous", email: "", student_id: "" },
        };
      })
    );

    return NextResponse.json(safeOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Create new order
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

    const buyerId = decoded.userId;

    const body = await request.json();
    const { productId, paymentMethod, receiptUrl, stripeSessionId } = body;

    // Validate required fields
    if (!productId || !paymentMethod) {
      return NextResponse.json(
        { error: "Product ID and payment method are required" },
        { status: 400 }
      );
    }

    if (!["BANK", "CARD"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Verify product exists and is available
    const product = await prisma.uniMartProducts.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Product is not available for purchase" },
        { status: 400 }
      );
    }

    // Prevent buying own product
    if (product.sellerId === buyerId) {
      return NextResponse.json(
        { error: "You cannot buy your own product" },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.uniMartOrder.create({
      data: {
        productId,
        buyerId,
        paymentMethod,
        paymentStatus: "PENDING",
        receiptUrl: paymentMethod === "BANK" ? receiptUrl : null,
        stripeSessionId: paymentMethod === "CARD" ? stripeSessionId : null,
      },
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

    // Update product status to RESERVED
    await prisma.uniMartProducts.update({
      where: { id: productId },
      data: { status: "RESERVED" },
    });

    // Handle null relations due to RLS policies
    const safeOrder = {
      ...order,
      product: order.product ? {
        ...order.product,
        seller: order.product.seller || { id: "", name: "Unknown Seller", email: "" },
      } : null,
      buyer: order.buyer || { id: "", name: "Anonymous", email: "", student_id: "" },
    };

    return NextResponse.json(safeOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
