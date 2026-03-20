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

  let userData = user;
  
  // If database query fails (RLS policies or user not synced yet),
  // return user object with data from JWT token
  if (!userData) {
    console.log("User not found in database, using JWT token data for userId:", payload.userId);
    userData = {
      id: payload.userId,
      student_id: payload.student_id || "",
      name: payload.name || "",
      email: payload.email || "",
    };
  }

  return Response.json({ user: userData });
}
