import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [notifications, total] = await Promise.all([
      prisma.app_notifications.findMany({
        where: { receiver_id: decoded.userId },
        orderBy: { created_at: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.app_notifications.count({
        where: { receiver_id: decoded.userId },
      }),
    ]);

    return NextResponse.json({
      notifications,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
