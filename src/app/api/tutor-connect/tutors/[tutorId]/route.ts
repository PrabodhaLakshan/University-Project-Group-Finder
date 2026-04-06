import { prisma } from "@/lib/prismaClient";

type Context = {
  params: Promise<{
    tutorId: string;
  }>;
};

export async function GET(_: Request, context: Context) {
  try {
    const { tutorId } = await context.params;

    const tutor = await prisma.tutors.findUnique({
      where: {
        id: tutorId,
      },
      select: {
        id: true,
        student_id: true,
        bio: true,
        subjects: true,
        language: true,
        expertise: true,
        ratings: true,
        reviews_count: true,
        users: {
          select: {
            name: true,
            year: true,
            semester: true,
          },
        },
        tutor_slots: {
          orderBy: [{ slot_date: "asc" }, { slot_time: "asc" }],
          select: {
            id: true,
            subject: true,
            slot_date: true,
            slot_time: true,
            is_booked: true,
            location: true,
          },
        },
      },
    });

    if (!tutor) {
      return new Response("Tutor not found", { status: 404 });
    }

    const user = tutor.users;

    const formattedTutor = {
      id: tutor.id,
      student_id: tutor.student_id,
      name: user?.name || tutor.student_id,
      yearAndSem:
        user?.year && user?.semester
          ? `Year ${user.year} - Semester ${user.semester}`
          : "University Student",
      bio: tutor.bio,
      subjects: tutor.subjects ?? [],
      language: tutor.language ?? [],
      expertise: tutor.expertise ?? [],
      ratings: tutor.ratings ? Number(tutor.ratings) : 0,
      reviews_count: tutor.reviews_count ?? 0,
      slots: tutor.tutor_slots.map((slot) => ({
        id: slot.id,
        subject: slot.subject,
        slot_date: slot.slot_date,
        slot_time: slot.slot_time,
        is_booked: slot.is_booked,
        location: slot.location,
      })),
    };

    return Response.json(formattedTutor);
  } catch (error) {
    console.error("GET /api/tutor-connect/tutors/[tutorId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}