import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

const formatDateInputValue = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const slots = await prisma.tutor_slots.findMany({
      where: {
        tutor_student_id: decoded.student_id,
      },
      orderBy: [
        { slot_date: "asc" },
        { slot_time: "asc" },
      ],
      include: {
        tutor_bookings: true,
      },
    });

    return Response.json(slots);
  } catch (error) {
    console.error("GET /api/tutor-connect/slots error:", error);
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
    const { date, time, subject } = body;

    if (!date || !time || !subject?.trim()) {
      return new Response("Date, time, and subject are required", { status: 400 });
    }

    const today = new Date();
    const todayStr = formatDateInputValue(today);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateStr = formatDateInputValue(maxDate);

    if (date < todayStr) {
      return new Response("Date cannot be in the past", { status: 400 });
    }

    if (date > maxDateStr) {
      return new Response("Please select a date within one month from today", { status: 400 });
    }

    const existingTutor = await prisma.tutors.findUnique({
      where: {
        student_id: decoded.student_id,
      },
    });

    if (!existingTutor) {
      return new Response("Tutor profile not found", { status: 404 });
    }

    const slot = await prisma.tutor_slots.create({
      data: {
        tutor_student_id: decoded.student_id,
        slot_date: new Date(date),
        slot_time: new Date(`1970-01-01T${time}:00`),
        subject: subject.trim(),
        is_booked: false,
      },
    });

    return Response.json({
      message: "Slot created successfully",
      slot,
    });
  } catch (error) {
    console.error("POST /api/tutor-connect/slots error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
