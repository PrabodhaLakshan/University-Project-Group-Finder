import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, context: Context) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;

    const notification = await prisma.tutor_notifications.findUnique({
      where: { id },
    });

    if (!notification) {
      return new Response("Notification not found", { status: 404 });
    }

    if (notification.student_id !== decoded.student_id) {
      return new Response("Forbidden", { status: 403 });
    }

    const updated = await prisma.tutor_notifications.update({
      where: { id },
      data: {
        is_read: true,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH notification error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}