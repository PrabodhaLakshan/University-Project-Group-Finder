import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("✅ User found:", { id: user.id, email: user.email });

    // if you stored hashed password in DB
    const ok = await bcrypt.compare(password, user.password);
    console.log("🔐 Password comparison result:", ok);
    
    if (!ok) {
      console.log("❌ Password mismatch for user:", email);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("✅ Authentication successful for:", email);

    const token = jwt.sign(
      { userId: user.id, student_id: user.student_id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: { id: user.id, student_id: user.student_id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    console.error("LOGIN_ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
