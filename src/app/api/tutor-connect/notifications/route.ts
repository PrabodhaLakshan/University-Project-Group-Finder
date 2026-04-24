import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const notifications = await prisma.tutor_notifications.findMany({
      where: {
        student_id: decoded.student_id,
      },
      orderBy: [{ created_at: "desc" }],
    });

    return Response.json(notifications);
  } catch (error) {
    console.error("GET /api/tutor-connect/notifications error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}