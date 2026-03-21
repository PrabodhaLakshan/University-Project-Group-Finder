import { prisma } from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  hasLengthBetween,
  isValidEmail,
  isValidId,
  normalizeEmail,
  normalizeString,
} from "@/lib/validation";

export const runtime = "nodejs";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student_id = normalizeString(body?.student_id);
    const name = normalizeString(body?.name);
    const email = normalizeEmail(body?.email);
    const password = (body?.password ?? "").toString();

    if (!student_id || !name || !email || !password) {
      return NextResponse.json(
        { message: "student_id, name, email, password required" },
        { status: 400 }
      );
    }

    if (!isValidId(student_id)) {
      return NextResponse.json(
        { message: "student_id must be 3-40 chars (letters, numbers, _ or -)" },
        { status: 400 }
      );
    }

    if (!hasLengthBetween(name, 2, 80)) {
      return NextResponse.json(
        { message: "name must be between 2 and 80 characters" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (!hasLengthBetween(password, 8, 72)) {
      return NextResponse.json(
        { message: "password must be between 8 and 72 characters" },
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

    const hashed = await bcrypt.hash(password, 10);

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
