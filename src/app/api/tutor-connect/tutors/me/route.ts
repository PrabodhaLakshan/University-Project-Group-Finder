import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const decoded = verifyToken(authHeader) as { student_id: string } | null;

    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const tutor = await prisma.tutors.findUnique({
      where: {
        student_id: decoded.student_id,
      },
    });

    return Response.json({
      isTutor: !!tutor,
      tutor,
    });
  } catch (error) {
    console.error("GET /api/tutor-connect/tutors/me error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}