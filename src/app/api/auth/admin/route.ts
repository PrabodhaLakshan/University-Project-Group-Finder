import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Hardcoded admin credentials — will be moved to DB later
const ADMIN_EMAIL = "uniadmin@gmail.com";
const ADMIN_PASSWORD = "uniadmin@2026";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").toString().toLowerCase().trim();
    const password = (body?.password ?? "").toString();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "Invalid admin credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { role: "admin", email: ADMIN_EMAIL, name: "UniNexus Admin" },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    return NextResponse.json({
      token,
      admin: { email: ADMIN_EMAIL, name: "UniNexus Admin", role: "admin" },
    });
  } catch (err: unknown) {
    console.error("ADMIN_LOGIN_ERROR:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
