import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const prismaDelegates = prisma as any;

function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  const payload = verifyToken(authHeader || undefined) as { userId?: string } | null;
  return payload?.userId || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let unreadCount = 0;

    try {
      // Preferred unread-count query for conversation-based chat.
      unreadCount = await prismaDelegates.message.count({
        where: {
          read: false,
          senderId: { not: userId },
          conversation: {
            OR: [{ buyerId: userId }, { sellerId: userId }],
          },
        },
      });
    } catch (primaryError) {
      console.warn(
        "Falling back to legacy unread count query:",
        primaryError
      );

      // Fallback for environments that still run on the legacy direct-message table.
      if (prismaDelegates.uniMartMessage) {
        unreadCount = await prismaDelegates.uniMartMessage.count({
          where: {
            receiverId: userId,
            read: false,
          },
        });
      }
    }

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("GET /api/unimart/messages/unread-count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 }
    );
  }
}
