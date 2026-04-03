import { prisma } from "@/lib/prismaClient";

export async function GET() {
  try {
    const tutors = await prisma.tutors.findMany({
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
          take: 1,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedTutors = tutors.map((tutor) => {
      const user = tutor.users as any;
      const nextSlot = tutor.tutor_slots[0] ?? null;

      return {
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
        nextAvailableSlot: nextSlot
          ? {
              id: nextSlot.id,
              subject: nextSlot.subject,
              slot_date: nextSlot.slot_date,
              slot_time: nextSlot.slot_time,
            }
          : null,
      };
    });

    return Response.json(formattedTutors);
  } catch (error) {
    console.error("GET /api/tutor-connect/student-dashboard error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}