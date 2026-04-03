import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

type Context = {
  params: Promise<{
    tutorStudentId: string;
  }>;
};

export async function GET(req: Request, context: Context) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { tutorStudentId } = await context.params;

    const eligibleBookings = await prisma.tutor_bookings.findMany({
      where: {
        student_id: decoded.student_id,
        status: {
          in: ["Confirmed", "Completed"],
        },
        tutor_feedback: null,
        tutor_slots: {
          tutor_student_id: tutorStudentId,
        },
      },
      orderBy: [{ created_at: "desc" }],
      select: {
        id: true,
        status: true,
        created_at: true,
        tutor_slots: {
          select: {
            subject: true,
            slot_date: true,
            slot_time: true,
          },
        },
      },
    });

    const formatted = eligibleBookings.map((booking) => ({
      booking_id: booking.id,
      status: booking.status,
      subject: booking.tutor_slots.subject,
      slot_date: booking.tutor_slots.slot_date,
      slot_time: booking.tutor_slots.slot_time,
      created_at: booking.created_at,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("GET /api/tutor-connect/feedback/eligible/[tutorStudentId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}