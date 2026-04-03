import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { slot_id, notes } = body;

    if (!slot_id) {
      return new Response("slot_id is required", { status: 400 });
    }

    const slot = await prisma.tutor_slots.findUnique({
      where: {
        id: slot_id,
      },
      include: {
        tutors: true,
        tutor_bookings: true,
      },
    });

    if (!slot) {
      return new Response("Slot not found", { status: 404 });
    }

    if (slot.is_booked) {
      return new Response("This slot is already booked", { status: 400 });
    }

    if (slot.tutor_student_id === decoded.student_id) {
      return new Response("You cannot book your own slot", { status: 400 });
    }

    const existingBooking = await prisma.tutor_bookings.findFirst({
      where: {
        slot_id,
      },
    });

    if (existingBooking) {
      return new Response("This slot has already been booked", { status: 400 });
    }

    const booking = await prisma.tutor_bookings.create({
      data: {
        student_id: decoded.student_id,
        slot_id,
        status: "Pending",
        notes: notes?.trim() || null,
      },
    });

    await prisma.tutor_slots.update({
      where: {
        id: slot_id,
      },
      data: {
        is_booked: true,
      },
    });

    return Response.json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("POST /api/tutor-connect/bookings error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}