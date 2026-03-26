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

export async function PUT(
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

      const updateResult = await prismaDelegates.uniMartMessage.updateMany({
        where: {
          senderId: legacyMeta.participantId,
          receiverId: userId,
          read: false,
          ...(legacyMeta.productId === "legacy-no-product"
            ? {}
            : { productId: legacyMeta.productId }),
        },
        data: { read: true },
      });

      return NextResponse.json({
        success: true,
        updatedCount: updateResult.count,
      });
    }

    const conversation = await prismaDelegates.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, buyerId: true, sellerId: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const isParticipant =
      conversation.buyerId === userId || conversation.sellerId === userId;

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateResult = await prismaDelegates.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({
      success: true,
      updatedCount: updateResult.count,
    });
  } catch (error) {
    console.error("PUT /api/unimart/messages/[conversationId]/read error:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
