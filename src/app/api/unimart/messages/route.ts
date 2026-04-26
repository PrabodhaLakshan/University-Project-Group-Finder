import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

const prismaDelegates = prisma as any;

function isLegacyConversationId(value: string): boolean {
  return typeof value === "string" && value.startsWith("legacy:");
}

function parseLegacyConversationId(value: string): {
  productId: string;
  currentUserId: string;
  participantId: string;
} | null {
  if (!isLegacyConversationId(value)) return null;
  const parts = value.split(":");
  if (parts.length !== 4) return null;
  const [, productId, currentUserId, participantId] = parts;
  if (!productId || !currentUserId || !participantId) return null;
  return { productId, currentUserId, participantId };
}

function buildLegacyConversationId(
  productId: string,
  currentUserId: string,
  participantId: string
): string {
  return `legacy:${productId}:${currentUserId}:${participantId}`;
}

function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  const payload = verifyToken(authHeader || undefined) as { userId?: string } | null;
  return payload?.userId || null;
}

// GET - Fetch all conversations for current user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    try {
      const conversations = await prismaDelegates.conversation.findMany({
        where: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
        include: {
          uniMartProducts: {
            select: {
              id: true,
              title: true,
              images: true,
            },
          },
          users_Conversation_buyerIdTousers: {
            select: { id: true, name: true },
          },
          users_Conversation_sellerIdTousers: {
            select: { id: true, name: true },
          },
          Message: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: {
              text: true,
              createdAt: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      const formattedConversations = await Promise.all(
        conversations.map(async (conv: any) => {
          const participant = conv.buyerId === userId
            ? conv.users_Conversation_sellerIdTousers
            : conv.users_Conversation_buyerIdTousers;
          const unreadCount = await prismaDelegates.Message.count({
            where: {
              conversationId: conv.id,
              read: false,
              senderId: { not: userId },
            },
          });

          return {
            id: conv.id,
            participantId: participant?.id || "",
            participantName: participant?.name || "Unknown",
            viewerRole: conv.buyerId === userId ? "buyer" : "seller",
            lastMessage: conv.Message[0]?.text || "",
            lastMessageTime: conv.Message[0]?.createdAt || conv.createdAt,
            unreadCount,
            productId: conv.productId,
            productTitle: conv.uniMartProducts?.title || "",
            productImage: conv.uniMartProducts?.images?.[0] || null,
            orderId: conv.orderId || null,
          };
        })
      );

      return NextResponse.json(formattedConversations);
    } catch (primaryError) {
      console.warn("Conversation query failed, using legacy conversations:", primaryError);

      const legacyMessages = await prismaDelegates.uniMartMessage.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          users_uniMartMessage_senderIdTousers: { select: { id: true, name: true } },
          users_uniMartMessage_receiverIdTousers: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const grouped = new Map<string, any>();

      for (const item of legacyMessages) {
        const participant = item.senderId === userId
          ? item.users_uniMartMessage_receiverIdTousers
          : item.users_uniMartMessage_senderIdTousers;
        const participantId = participant?.id;
        if (!participantId) continue;

        const productId = item.productId || "legacy-no-product";
        const key = `${productId}:${participantId}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            id: buildLegacyConversationId(productId, userId, participantId),
            participantId,
            participantName: participant?.name || "Unknown",
            viewerRole: "unknown",
            lastMessage: item.content || "",
            lastMessageTime: item.createdAt,
            unreadCount: 0,
            productId: item.productId || "",
            productTitle: "",
            productImage: null,
            orderId: null,
          });
        }

        if (item.receiverId === userId && !item.read) {
          grouped.get(key).unreadCount += 1;
        }
      }

      return NextResponse.json(Array.from(grouped.values()));
    }
  } catch (error) {
    console.error("GET /api/unimart/messages error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch conversations: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST - Send message to an existing conversation
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const conversationId = typeof body?.conversationId === "string" ? body.conversationId : "";
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!conversationId || !text) {
      return NextResponse.json(
        { error: "conversationId and text are required" },
        { status: 400 }
      );
    }

    const legacyMeta = parseLegacyConversationId(conversationId);
    if (legacyMeta) {
      if (legacyMeta.currentUserId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const legacyMessage = await prismaDelegates.uniMartMessage.create({
        data: {
          content: text,
          senderId: userId,
          receiverId: legacyMeta.participantId,
          productId:
            legacyMeta.productId === "legacy-no-product"
              ? null
              : legacyMeta.productId,
        },
        include: {
          users_uniMartMessage_senderIdTousers: {
            select: { id: true, name: true },
          },
        },
      });

      await createNotification({
        userId: legacyMeta.participantId,
        title: "New message",
        message: "You received a new message.",
        type: "NEW_MESSAGE",
        link: `/modules/uni-mart/messages?conversationId=${conversationId}`,
      });

      return NextResponse.json({
        id: legacyMessage.id,
        conversationId,
        senderId: legacyMessage.senderId,
        senderName: legacyMessage.users_uniMartMessage_senderIdTousers?.name || "Unknown",
        text: legacyMessage.content,
        read: legacyMessage.read,
        createdAt: legacyMessage.createdAt,
      });
    }

    const conversation = await prismaDelegates.conversation.findUnique({
      where: { id: conversationId },
      include: {
        product: {
          select: { id: true, title: true },
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

    const receiverId = conversation.buyerId === userId
      ? conversation.sellerId
      : conversation.buyerId;

    const message = await prismaDelegates.message.create({
      data: {
        conversationId,
        senderId: userId,
        text,
      },
      include: {
        users: {
          select: { id: true, name: true },
        },
      },
    });

    await prismaDelegates.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    await createNotification({
      userId: receiverId,
      title: "New message",
      message: `You received a message about ${conversation.product?.title || "a product"}.`,
      type: "NEW_MESSAGE",
      link: `/modules/uni-mart/messages?conversationId=${conversationId}`,
    });

    return NextResponse.json({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.users?.name || "Unknown",
      text: message.text,
      read: message.read,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error("POST /api/unimart/messages error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
