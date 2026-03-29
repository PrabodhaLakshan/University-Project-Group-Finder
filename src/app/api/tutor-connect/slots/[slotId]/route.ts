import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

type Context = {
  params: Promise<{
    slotId: string;
  }>;
};

export async function DELETE(req: Request, context: Context) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { slotId } = await context.params;

    const slot = await prisma.tutor_slots.findUnique({
      where: {
        id: slotId,
      },
    });

    if (!slot) {
      return new Response("Slot not found", { status: 404 });
    }

    if (slot.tutor_student_id !== decoded.student_id) {
      return new Response("Forbidden", { status: 403 });
    }

    await prisma.tutor_slots.delete({
      where: {
        id: slotId,
      },
    });

    return Response.json({
      message: "Slot deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/tutor-connect/slots/[slotId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}