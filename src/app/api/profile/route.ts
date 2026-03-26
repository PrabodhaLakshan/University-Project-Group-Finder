import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { requireUserFromRequest } from "@/lib/auth-server";
import { prisma } from "@/lib/prismaClient";

export async function GET(req: Request) {
    try {
        const currentUser = await requireUserFromRequest(req);

        const user = await prisma.users.findUnique({
            where: { id: currentUser.id },
            select: {
                id: true,
                student_id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                ...user,
                password: "********",
            },
        });
    } catch (error) {
        console.error("Profile GET API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to load profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const body = await req.json();

        const name = (body?.name ?? "").toString().trim();
        const newPassword = (body?.newPassword ?? "").toString();
        const confirmPassword = (body?.confirmPassword ?? "").toString();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (name.length > 100) {
            return NextResponse.json({ error: "Name is too long" }, { status: 400 });
        }

        const isUpdatingPassword = !!(newPassword || confirmPassword);

        if (isUpdatingPassword && (!newPassword || !confirmPassword)) {
            return NextResponse.json(
                { error: "New password and confirm password are required" },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: "New password and confirm password do not match" },
                { status: 400 }
            );
        }

        if (newPassword && newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.users.update({
            where: { id: currentUser.id },
            data: {
                name,
                ...(newPassword ? { password: await bcrypt.hash(newPassword, 10) } : {}),
            },
            select: {
                id: true,
                student_id: true,
                name: true,
                email: true,
            },
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                ...updatedUser,
                password: "********",
            },
        });
    } catch (error) {
        console.error("Profile PATCH API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
