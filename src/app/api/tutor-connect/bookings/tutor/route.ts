import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const bookings = await prisma.tutor_bookings.findMany({
      where: {
        tutor_slots: {
          tutor_student_id: decoded.student_id,
        },
      },
      orderBy: [{ created_at: "desc" }],
      select: {
        id: true,
        status: true,
        notes: true,
        created_at: true,
        student_id: true,
        users: {
          select: {
            name: true,
          },
        },
        tutor_slots: {
          select: {
            id: true,
            subject: true,
            slot_date: true,
            slot_time: true,
            location: true,
          },
        },
      },
    });

    const formatted = bookings.map((booking) => {
      const student = booking.users;

      return {
        id: booking.id,
        status: booking.status,
        notes: booking.notes,
        created_at: booking.created_at,
        student: {
          student_id: booking.student_id,
          name: student?.name || booking.student_id,
        },
        slot: {
          id: booking.tutor_slots.id,
          subject: booking.tutor_slots.subject,
          date: booking.tutor_slots.slot_date,
          time: booking.tutor_slots.slot_time,
          location: booking.tutor_slots.location,
        },
      };
    });

    return Response.json(formatted);
  } catch (error) {
    console.error("GET /api/tutor-connect/bookings/tutor error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}