import { prisma } from "@/lib/prismaClient";
import { isValidPassword, isValidSliitEmail, isValidStudentId, normalizeEmail, normalizeString, sanitizeStudentId } from "@/lib/validation";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student_id = sanitizeStudentId(body?.student_id);
    const name = normalizeString(body?.name);
    const email = normalizeEmail(body?.email);
    const password = (body?.password ?? "").toString();

    if (!student_id || !name || !email || !password) {
      return NextResponse.json(
        { message: "student_id, name, email, password required" },
        { status: 400 }
      );
    }

    if (!isValidSliitEmail(email)) {
      return NextResponse.json(
        { message: "Email must end with @my.sliit.lk" },
        { status: 400 }
      );
    }

    if (!isValidStudentId(student_id)) {
      return NextResponse.json(
        { message: "Student ID must start with 2 letters followed by 8 digits" },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters and include at least 1 letter and 1 number" },
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
