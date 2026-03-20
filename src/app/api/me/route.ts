import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth-server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  const payload: any = verifyToken(authHeader || undefined);

  if (!payload) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.users.findUnique({
    where: { id: payload.userId },
    select: { id: true, student_id: true, name: true, email: true, avatar_path: true },
  });

  return Response.json({ user });
}
