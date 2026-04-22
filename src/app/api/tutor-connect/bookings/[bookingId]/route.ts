import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

type Context = {
  params: Promise<{
    bookingId: string;
  }>;
};

async function assignFirstWaitlistedStudent(slotId: string) {
  const firstWaitlisted = await prisma.tutor_waitlist.findFirst({
    where: {
      slot_id: slotId,
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      id: true,
      student_id: true,
      slot_id: true,
      tutor_slots: {
        select: {
          subject: true,
        },
      },
    },
  });

  if (!firstWaitlisted) {
    await prisma.tutor_slots.update({
      where: {
        id: slotId,
      },
      data: {
        is_booked: false,
      },
    });

    return null;
  }

  const newBooking = await prisma.tutor_bookings.create({
    data: {
      student_id: firstWaitlisted.student_id,
      slot_id: slotId,
      status: "Confirmed",
    },
  });

  await prisma.tutor_slots.update({
    where: {
      id: slotId,
    },
    data: {
      is_booked: true,
    },
  });

  await prisma.tutor_notifications.create({
    data: {
      id: crypto.randomUUID(),
      student_id: firstWaitlisted.student_id,
      title: "Waitlist Approved",
      message: `A slot is now available and your waitlist request for ${firstWaitlisted.tutor_slots.subject} has been approved.`,
    },
  });

  await prisma.tutor_waitlist.delete({
    where: {
      id: firstWaitlisted.id,
    },
  });

  return newBooking;
}

export async function PATCH(req: Request, context: Context) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { bookingId } = await context.params;
    const body = await req.json();
    const nextStatus = String(body?.status || "").trim();

    if (!["Confirmed", "Cancelled", "Pending", "Completed"].includes(nextStatus)) {
      return new Response("Invalid status", { status: 400 });
    }

    const booking = await prisma.tutor_bookings.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        student_id: true,
        slot_id: true,
        tutor_slots: {
          select: {
            tutor_student_id: true,
            subject: true,
            slot_date: true,
            slot_time: true,
            location: true,
          },
        },
      },
    });

    if (!booking) {
      return new Response("Booking not found", { status: 404 });
    }

    if (booking.tutor_slots.tutor_student_id !== decoded.student_id) {
      return new Response("Forbidden", { status: 403 });
    }

    if (nextStatus === "Cancelled") {
      await prisma.tutor_bookings.delete({
        where: {
          id: bookingId,
        },
      });

      const reassigned = await assignFirstWaitlistedStudent(booking.slot_id);

      return Response.json({
        message: reassigned
          ? "Booking cancelled and slot assigned to first waitlisted student"
          : "Booking cancelled and slot is now available",
        reassigned,
      });
    }

    const updatedBooking = await prisma.tutor_bookings.update({
      where: {
        id: bookingId,
      },
      data: {
        status: nextStatus,
      },
    });

    if (nextStatus === "Confirmed") {
      await prisma.tutor_slots.update({
        where: {
          id: booking.slot_id,
        },
        data: {
          is_booked: true,
        },
      });

      const formattedDate = new Date(booking.tutor_slots.slot_date).toLocaleDateString();
      const formattedTime = new Date(booking.tutor_slots.slot_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      await prisma.tutor_notifications.create({
        data: {
          id: crypto.randomUUID(),
          student_id: booking.student_id,
          title: "Booking Confirmed",
          message: `Your ${booking.tutor_slots.subject} tutoring session has been confirmed for ${formattedDate} at ${formattedTime}${booking.tutor_slots.location ? `, at ${booking.tutor_slots.location}` : ""}. Please be on time and be ready for your session.`,
        },
      });
    }

    if (nextStatus === "Pending") {
      await prisma.tutor_slots.update({
        where: {
          id: booking.slot_id,
        },
        data: {
          is_booked: true,
        },
      });
    }

    if (nextStatus === "Completed") {
      await prisma.tutor_slots.update({
        where: {
          id: booking.slot_id,
        },
        data: {
          is_booked: true,
        },
      });
    }

    return Response.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("PATCH /api/tutor-connect/bookings/[bookingId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { bookingId } = await context.params;

    const booking = await prisma.tutor_bookings.findUnique({
      where: {
        id: bookingId,
      },
      select: {
        id: true,
        student_id: true,
        slot_id: true,
      },
    });

    if (!booking) {
      return new Response("Booking not found", { status: 404 });
    }

    if (booking.student_id !== decoded.student_id) {
      return new Response("Forbidden", { status: 403 });
    }

    await prisma.tutor_bookings.delete({
      where: {
        id: bookingId,
      },
    });

    const reassigned = await assignFirstWaitlistedStudent(booking.slot_id);

    return Response.json({
      message: reassigned
        ? "Booking cancelled and slot assigned to first waitlisted student"
        : "Booking cancelled successfully",
      reassigned,
    });
  } catch (error) {
    console.error("DELETE /api/tutor-connect/bookings/[bookingId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}