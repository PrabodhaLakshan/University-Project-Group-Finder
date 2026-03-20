import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";

type Params = {
    params: Promise<{ id: string; memberId: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId, memberId } = await params;

        const membership = await prisma.project_group_members.findUnique({
            where: {
                group_id_user_id: {
                    group_id: BigInt(groupId),
                    user_id: currentUser.id,
                },
            },
        });

        if (!membership || membership.role !== "leader") {
            return NextResponse.json(
                { error: "Only group leaders can change roles" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { role } = body;

        if (!["leader", "member", "reviewer"].includes(role)) {
            return NextResponse.json(
                { error: "Invalid role specified" },
                { status: 400 }
            );
        }

        await prisma.project_group_members.update({
            where: {
                group_id_user_id: {
                    group_id: BigInt(groupId),
                    user_id: memberId,
                },
            },
            data: {
                role,
            },
        });

        return NextResponse.json({
            message: "Role updated successfully"
        });
    } catch (error) {
        console.error("Update role API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to update member role" },
            { status: 500 }
        );
    }
}
