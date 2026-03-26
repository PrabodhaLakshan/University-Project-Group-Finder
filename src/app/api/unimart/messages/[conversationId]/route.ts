import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

function parseLegacyConversationId(value: string): {
  productId: string;
  currentUserId: string;
  participantId: string;
} | null {
  if (!value.startsWith("legacy:")) return null;
  const parts = value.split(":");
  if (parts.length !== 4) return null;
  const [, productId, currentUserId, participantId] = parts;
  if (!productId || !currentUserId || !participantId) return null;
  return { productId, currentUserId, participantId };
}

function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  const payload = verifyToken(authHeader || undefined) as { userId?: string } | null;
  return payload?.userId || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;

    const legacyMeta = parseLegacyConversationId(conversationId);
    if (legacyMeta) {
      if (legacyMeta.currentUserId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const participant = await prismaDelegates.users.findUnique({
        where: { id: legacyMeta.participantId },
        select: { id: true, name: true },
      });

      const legacyMessages = await prismaDelegates.uniMartMessage.findMany({
        where: {
          OR: [
            {
              senderId: userId,
              receiverId: legacyMeta.participantId,
            },
            {
              senderId: legacyMeta.participantId,
              receiverId: userId,
            },
          ],
          ...(legacyMeta.productId === "legacy-no-product"
            ? {}
            : { productId: legacyMeta.productId }),
        },
        include: {
          sender: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({
        conversation: {
          id: conversationId,
          participantId: participant?.id || legacyMeta.participantId,
          participantName: participant?.name || "Unknown",
          productId:
            legacyMeta.productId === "legacy-no-product"
              ? ""
              : legacyMeta.productId,
          productTitle: "",
          orderId: null,
        },
        messages: legacyMessages.map((message: any) => ({
          id: message.id,
          conversationId,
          senderId: message.senderId,
          senderName: message.sender?.name || "Unknown",
          text: message.content,
          read: message.read,
          createdAt: message.createdAt,
        })),
      });
    }

    const conversation = await prismaDelegates.conversation.findUnique({
      where: { id: conversationId },
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
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const isParticipant =
      conversation.buyerId === userId || conversation.sellerId === userId;

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await prismaDelegates.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const participant = conversation.buyerId === userId ? conversation.seller : conversation.buyer;

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        participantId: participant?.id || "",
        participantName: participant?.name || "Unknown",
        productId: conversation.productId,
        productTitle: conversation.product?.title || "",
        orderId: conversation.orderId || null,
      },
      messages: messages.map((message: any) => ({
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: message.sender?.name || "Unknown",
        text: message.text,
        read: message.read,
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/unimart/messages/[conversationId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
