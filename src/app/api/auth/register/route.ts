import { prisma } from "@/lib/prismaClient";
import bcryptjs from "bcryptjs";

export const runtime = "nodejs";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student_id = (body?.student_id ?? "").toString().trim();
    const name = (body?.name ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();

    if (!student_id || !name || !email || !password) {
      return NextResponse.json(
        { message: "student_id, name, email, password required" },
        { status: 400 }
      );
    }

    // Check existing student_id or email
    const existing = await prisma.users.findFirst({
      where: {
        OR: [{ student_id }, { email }],
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Student ID or Email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcryptjs.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        student_id,
        name,
        email,
        password: hashed,
        skills: [], // required array in schema
      },
      select: { id: true, student_id: true, name: true, email: true, created_at: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e: unknown) {
    console.error("REGISTER_ERROR:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { message: "Server error", error: message },
      { status: 500 }
    );
  }
}
