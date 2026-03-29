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
      include: {
        users: true,
        tutor_slots: {
          where: {
            is_booked: false,
          },
          orderBy: [
            { slot_date: "asc" },
            { slot_time: "asc" },
          ],
        },
      },
    });

    if (!tutor) {
      return new Response("Tutor not found", { status: 404 });
    }

    const user = tutor.users as any;

    const formattedTutor = {
      id: tutor.id,
      student_id: tutor.student_id,
      name:
        user?.full_name ||
        user?.name ||
        user?.student_name ||
        user?.first_name ||
        tutor.student_id,
      yearAndSem:
        user?.yearAndSem ||
        user?.year_sem ||
        user?.academic_level ||
        "University Student",
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
      })),
    };

    return Response.json(formattedTutor);
  } catch (error) {
    console.error("GET /api/tutor-connect/tutors/[tutorId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}