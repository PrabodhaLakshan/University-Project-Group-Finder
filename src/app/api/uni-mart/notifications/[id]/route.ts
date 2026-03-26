import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const decoded = verifyToken(authHeader || "") as any;

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await prisma.app_notifications.updateMany({
      where: {
        id,
        receiver_id: decoded.userId,
      },
      data: {
        is_read: true,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id, is_read: true });
  } catch (error) {
    console.error("PUT /api/notifications/[id]/read error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
