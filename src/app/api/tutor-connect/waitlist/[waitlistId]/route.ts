import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

type Context = {
  params: Promise<{
    waitlistId: string;
  }>;
};

export async function PATCH(req: Request, context: Context) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { waitlistId } = await context.params;
    const body = await req.json();
    const action = String(body?.action || "").trim();

    if (!["approve", "decline"].includes(action)) {
      return new Response("Invalid action", { status: 400 });
    }

    const waitlistEntry = await prisma.tutor_waitlist.findUnique({
      where: {
        id: waitlistId,
      },
      select: {
        id: true,
        student_id: true,
        slot_id: true,
        tutor_slots: {
          select: {
            id: true,
            tutor_student_id: true,
            is_booked: true,
          },
        },
      },
    });

    if (!waitlistEntry) {
      return new Response("Waitlist entry not found", { status: 404 });
    }

    if (waitlistEntry.tutor_slots.tutor_student_id !== decoded.student_id) {
      return new Response("Forbidden", { status: 403 });
    }

    if (action === "decline") {
      await prisma.tutor_waitlist.delete({
        where: {
          id: waitlistId,
        },
      });

      return Response.json({
        message: "Waitlist request declined successfully",
      });
    }

    const existingBooking = await prisma.tutor_bookings.findFirst({
      where: {
        slot_id: waitlistEntry.slot_id,
      },
    });

    if (existingBooking) {
      return new Response("This slot is already assigned to another student", {
        status: 400,
      });
    }

    const booking = await prisma.tutor_bookings.create({
      data: {
        student_id: waitlistEntry.student_id,
        slot_id: waitlistEntry.slot_id,
        status: "Confirmed",
      },
    });

    await prisma.tutor_slots.update({
      where: {
        id: waitlistEntry.slot_id,
      },
      data: {
        is_booked: true,
      },
    });

    await prisma.tutor_waitlist.delete({
      where: {
        id: waitlistId,
      },
    });

    return Response.json({
      message: "Waitlist student approved successfully",
      booking,
    });
  } catch (error) {
    console.error("PATCH /api/tutor-connect/waitlist/[waitlistId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}