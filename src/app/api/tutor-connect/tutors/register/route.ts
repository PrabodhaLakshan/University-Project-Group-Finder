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

    const existing = await prisma.tutors.findUnique({
      where: {
        student_id: decoded.student_id,
      },
    });

    if (existing) {
      return new Response("Already a tutor", { status: 400 });
    }

    const tutor = await prisma.tutors.create({
      data: {
        student_id: decoded.student_id,
        bio: body.bio ?? "",
        subjects: Array.isArray(body.subjects) ? body.subjects : [],
        language: Array.isArray(body.language) ? body.language : [],
      },
    });

    return Response.json({
      message: "Tutor registered successfully",
      tutor,
    });
  } catch (error) {
    console.error("POST /api/tutor-connect/tutors/register error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}