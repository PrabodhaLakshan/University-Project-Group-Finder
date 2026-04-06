import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const feedbacks = await prisma.tutor_feedback.findMany({
      where: {
        tutor_student_id: decoded.student_id,
      },
      orderBy: [{ created_at: "desc" }],
      select: {
        id: true,
        rating: true,
        comment: true,
        created_at: true,
        student_id: true,
        users: {
          select: {
            name: true,
          },
        },
        tutor_bookings: {
          select: {
            tutor_slots: {
              select: {
                subject: true,
                slot_date: true,
              },
            },
          },
        },
      },
    });

    const formatted = feedbacks.map((item) => ({
      id: item.id,
      studentName: item.users?.name || item.student_id,
      subject: item.tutor_bookings.tutor_slots.subject,
      rating: item.rating,
      date: item.created_at,
      comment: item.comment,
      sessionDate: item.tutor_bookings.tutor_slots.slot_date,
      helpful: 0,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("GET /api/tutor-connect/feedback error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const booking_id = String(body?.booking_id || "").trim();
    const comment = String(body?.comment || "").trim();
    const rating = Number(body?.rating);

    if (!booking_id) {
      return new Response("booking_id is required", { status: 400 });
    }

    if (!comment || comment.length < 10) {
      return new Response("comment must be at least 10 characters", { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return new Response("rating must be between 1 and 5", { status: 400 });
    }

    const booking = await prisma.tutor_bookings.findUnique({
      where: {
        id: booking_id,
      },
      select: {
        id: true,
        student_id: true,
        status: true,
        tutor_feedback: {
          select: {
            id: true,
          },
        },
        tutor_slots: {
          select: {
            tutor_student_id: true,
          },
        },
      },
    });

    if (!booking) {
      return new Response("Booking not found", { status: 404 });
    }

    if (booking.student_id !== decoded.student_id) {
      return new Response("You can only review your own booking", { status: 403 });
    }

    if (!["Confirmed", "Completed"].includes(booking.status || "")) {
      return new Response("Only confirmed or completed bookings can be reviewed", {
        status: 400,
      });
    }

    if (booking.tutor_feedback) {
      return new Response("Feedback was already submitted for this booking", {
        status: 400,
      });
    }

    const feedback = await prisma.tutor_feedback.create({
      data: {
        tutor_student_id: booking.tutor_slots.tutor_student_id,
        student_id: decoded.student_id,
        booking_id: booking.id,
        rating,
        comment,
      },
    });

    const aggregate = await prisma.tutor_feedback.aggregate({
      where: {
        tutor_student_id: booking.tutor_slots.tutor_student_id,
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    await prisma.tutors.update({
      where: {
        student_id: booking.tutor_slots.tutor_student_id,
      },
      data: {
        ratings: aggregate._avg.rating ?? 0,
        reviews_count: aggregate._count.id ?? 0,
      },
    });

    return Response.json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("POST /api/tutor-connect/feedback error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}