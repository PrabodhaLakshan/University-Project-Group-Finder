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
        student_id: decoded.student_id,
      },
      orderBy: [{ created_at: "desc" }],
      select: {
        id: true,
        status: true,
        notes: true,
        created_at: true,
        tutor_slots: {
          select: {
            id: true,
            subject: true,
            slot_date: true,
            slot_time: true,
            location: true,
            tutors: {
              select: {
                student_id: true,
                users: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formatted = bookings.map((booking) => {
      const tutor = booking.tutor_slots.tutors;
      const user = tutor.users;

      return {
        id: booking.id,
        status: booking.status,
        notes: booking.notes,
        created_at: booking.created_at,
        slot: {
          id: booking.tutor_slots.id,
          subject: booking.tutor_slots.subject,
          date: booking.tutor_slots.slot_date,
          time: booking.tutor_slots.slot_time,
          location: booking.tutor_slots.location,
        },
        tutor: {
          student_id: tutor.student_id,
          name: user?.name || tutor.student_id,
        },
      };
    });

    return Response.json(formatted);
  } catch (error) {
    console.error("GET /api/tutor-connect/bookings/me error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}