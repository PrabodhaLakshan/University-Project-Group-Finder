import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { hasLengthBetween, isValidEmail, normalizeEmail } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body?.email);
    const password = (body?.password ?? "").toString();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (!hasLengthBetween(password, 8, 72)) {
      return NextResponse.json({ message: "Invalid password length" }, { status: 400 });
    }

    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // if you stored hashed password in DB
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, student_id: user.student_id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: { id: user.id, student_id: user.student_id, email: user.email, name: user.name },
    });
  } catch (err: unknown) {
    console.error("LOGIN_ERROR:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
