import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const tutorStudentId = decoded.student_id;

    const [
      totalSlots,
      bookedSessions,
      waitlistRequests,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      tutorRecord,
    ] = await Promise.all([
      prisma.tutor_slots.count({
        where: {
          tutor_student_id: tutorStudentId,
        },
      }),

      prisma.tutor_bookings.count({
        where: {
          tutor_slots: {
            tutor_student_id: tutorStudentId,
          },
        },
      }),

      prisma.tutor_waitlist.count({
        where: {
          tutor_slots: {
            tutor_student_id: tutorStudentId,
          },
        },
      }),

      prisma.tutor_bookings.count({
        where: {
          status: "Pending",
          tutor_slots: {
            tutor_student_id: tutorStudentId,
          },
        },
      }),

      prisma.tutor_bookings.count({
        where: {
          status: "Confirmed",
          tutor_slots: {
            tutor_student_id: tutorStudentId,
          },
        },
      }),

      prisma.tutor_bookings.count({
        where: {
          status: "Completed",
          tutor_slots: {
            tutor_student_id: tutorStudentId,
          },
        },
      }),

      prisma.tutors.findUnique({
        where: {
          student_id: tutorStudentId,
        },
        select: {
          ratings: true,
          reviews_count: true,
        },
      }),
    ]);

    const occupancyRate =
      totalSlots > 0 ? Math.round((bookedSessions / totalSlots) * 100) : 0;

    return Response.json({
      totalSlots,
      bookedSessions,
      waitlistRequests,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      occupancyRate,
      averageRating: tutorRecord?.ratings ? Number(tutorRecord.ratings) : 0,
      reviewsCount: tutorRecord?.reviews_count ?? 0,
    });
  } catch (error) {
    console.error("GET /api/tutor-connect/dashboard/stats error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}