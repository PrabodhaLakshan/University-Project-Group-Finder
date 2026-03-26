import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

function buildLegacyConversationId(
  productId: string,
  currentUserId: string,
  participantId: string
) {
  return `legacy:${productId}:${currentUserId}:${participantId}`;
}

function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  const payload = verifyToken(authHeader || undefined) as { userId?: string } | null;
  return payload?.userId || null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const productId = typeof body?.productId === "string" ? body.productId : "";
    const requestedSellerId = typeof body?.sellerId === "string" ? body.sellerId : null;
    const orderId = typeof body?.orderId === "string" ? body.orderId : null;

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const product = await prismaDelegates.uniMartProducts.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        sellerId: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const sellerId = requestedSellerId || product.sellerId;
    let buyerId = userId;

    if (sellerId !== product.sellerId) {
      return NextResponse.json({ error: "Invalid seller for product" }, { status: 400 });
    }

    if (sellerId === userId && !orderId) {
      return NextResponse.json(
        { error: "You cannot start a chat with yourself" },
        { status: 400 }
      );
    }

    if (orderId) {
      const order = await prismaDelegates.uniMartOrder.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          buyerId: true,
          productId: true,
          product: { select: { sellerId: true } },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const isAllowedOrderParticipant =
        order.buyerId === userId || order.product?.sellerId === userId;

      if (!isAllowedOrderParticipant) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (order.productId !== productId) {
        return NextResponse.json(
          { error: "Order does not belong to this product" },
          { status: 400 }
        );
      }

      buyerId = order.buyerId;
    }

    try {
      let conversation = await prismaDelegates.conversation.findUnique({
        where: {
          productId_buyerId_sellerId: {
            productId,
            buyerId,
            sellerId,
          },
        },
        include: {
          product: {
            select: { id: true, title: true },
          },
          buyer: {
            select: { id: true, name: true },
          },
          seller: {
            select: { id: true, name: true },
          },
        },
      });

      if (!conversation) {
        conversation = await prismaDelegates.conversation.create({
          data: {
            productId,
            buyerId,
            sellerId,
            ...(orderId ? { orderId } : {}),
          },
          include: {
            product: {
              select: { id: true, title: true },
            },
            buyer: {
              select: { id: true, name: true },
            },
            seller: {
              select: { id: true, name: true },
            },
          },
        });
      } else if (orderId && !conversation.orderId) {
        conversation = await prismaDelegates.conversation.update({
          where: { id: conversation.id },
          data: { orderId },
          include: {
            product: {
              select: { id: true, title: true },
            },
            buyer: {
              select: { id: true, name: true },
            },
            seller: {
              select: { id: true, name: true },
            },
          },
        });
      }

      return NextResponse.json({
        id: conversation.id,
        productId: conversation.productId,
        productTitle: conversation.product?.title || "",
        buyerId: conversation.buyerId,
        buyerName: conversation.buyer?.name || "",
        sellerId: conversation.sellerId,
        sellerName: conversation.seller?.name || "",
        orderId: conversation.orderId || null,
        createdAt: conversation.createdAt,
      });
    } catch (conversationError) {
      console.warn(
        "Conversation table unavailable, using legacy chat fallback:",
        conversationError
      );

      const participantId = userId === sellerId ? buyerId : sellerId;
      const legacyId = buildLegacyConversationId(productId, userId, participantId);

      return NextResponse.json({
        id: legacyId,
        productId,
        productTitle: product.title,
        buyerId,
        sellerId,
        orderId,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("POST /api/unimart/chat/start error:", error);
    return NextResponse.json(
      { error: "Failed to start chat" },
      { status: 500 }
    );
  }
}
