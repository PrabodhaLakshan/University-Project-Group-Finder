import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const waitlistEntries = await prisma.tutor_waitlist.findMany({
      where: {
        tutor_slots: {
          tutor_student_id: decoded.student_id,
        },
      },
      orderBy: [{ created_at: "asc" }],
      select: {
        id: true,
        student_id: true,
        created_at: true,
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
            tutor_student_id: true,
          },
        },
      },
    });

    const formatted = waitlistEntries.map((entry, index) => ({
      id: entry.id,
      student_id: entry.student_id,
      studentName: entry.users?.name || entry.student_id,
      subject: entry.tutor_slots.subject,
      requestedDate: entry.tutor_slots.slot_date,
      requestedTime: entry.tutor_slots.slot_time,
      location: entry.tutor_slots.location,
      requestDate: entry.created_at,
      priority:
        index === 0 ? "High" : index === 1 ? "Medium" : "Low",
      slot_id: entry.tutor_slots.id,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("GET /api/tutor-connect/waitlist error:", error);
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
    const { slot_id } = body;

    if (!slot_id) {
      return new Response("slot_id is required", { status: 400 });
    }

    const slot = await prisma.tutor_slots.findUnique({
      where: {
        id: slot_id,
      },
      select: {
        id: true,
        tutor_student_id: true,
        is_booked: true,
      },
    });

    if (!slot) {
      return new Response("Slot not found", { status: 404 });
    }

    if (slot.tutor_student_id === decoded.student_id) {
      return new Response("You cannot join the waitlist for your own slot", { status: 400 });
    }

    if (!slot.is_booked) {
      return new Response("This slot is still available. You can book it directly.", { status: 400 });
    }

    const existingWaitlist = await prisma.tutor_waitlist.findFirst({
      where: {
        slot_id,
        student_id: decoded.student_id,
      },
    });

    if (existingWaitlist) {
      return new Response("You have already joined this waitlist", { status: 400 });
    }

    const existingBooking = await prisma.tutor_bookings.findFirst({
      where: {
        slot_id,
        student_id: decoded.student_id,
      },
    });

    if (existingBooking) {
      return new Response("You already have a booking for this slot", { status: 400 });
    }

    const waitlistEntry = await prisma.tutor_waitlist.create({
      data: {
        slot_id,
        student_id: decoded.student_id,
      },
    });

    return Response.json({
      message: "Joined waitlist successfully",
      waitlistEntry,
    });
  } catch (error) {
    console.error("POST /api/tutor-connect/waitlist error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}