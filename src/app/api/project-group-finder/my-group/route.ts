import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";

export async function GET(req: Request) {
    try {
        const currentUser = await requireUserFromRequest(req);

        const membership = await prisma.project_group_members.findUnique({
            where: {
                user_id: currentUser.id,
            },
            include: {
                project_group: true,
            },
        });

        if (!membership || !membership.project_group) {
            return NextResponse.json({ groupId: null });
        }

        return NextResponse.json({
            groupId: membership.group_id.toString(),
        });
    } catch (error) {
        console.error("My group API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to get current group" },
            { status: 500 }
        );
    }
}
