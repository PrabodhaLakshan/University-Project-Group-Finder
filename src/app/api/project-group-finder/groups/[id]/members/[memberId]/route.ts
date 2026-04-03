import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";

type Params = {
    params: Promise<{ id: string; memberId: string }>;
};

export async function DELETE(req: Request, { params }: Params) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId, memberId } = await params;
        const parsedGroupId = BigInt(groupId);

        const leaderMembership = await prisma.project_group_members.findUnique({
            where: {
                group_id_user_id: {
                    group_id: parsedGroupId,
                    user_id: currentUser.id,
                },
            },
        });

        if (!leaderMembership || leaderMembership.role !== "leader") {
            return NextResponse.json(
                { error: "Only group leaders can remove members" },
                { status: 403 }
            );
        }

        if (memberId === currentUser.id) {
            return NextResponse.json(
                { error: "Use leave group if you want to remove yourself" },
                { status: 400 }
            );
        }

        const targetMembership = await prisma.project_group_members.findUnique({
            where: {
                group_id_user_id: {
                    group_id: parsedGroupId,
                    user_id: memberId,
                },
            },
            include: {
                users: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!targetMembership) {
            return NextResponse.json(
                { error: "Member not found in this group" },
                { status: 404 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            await tx.project_group_members.delete({
                where: {
                    group_id_user_id: {
                        group_id: parsedGroupId,
                        user_id: memberId,
                    },
                },
            });

            const updatedCount = await tx.project_group_members.count({
                where: { group_id: parsedGroupId },
            });

            const group = await tx.project_group.findUnique({
                where: { id: parsedGroupId },
                select: { max_members: true },
            });

            const nextStatus = updatedCount >= (group?.max_members ?? 4) ? "full" : "active";

            await tx.project_group.update({
                where: { id: parsedGroupId },
                data: { status: nextStatus },
            });

            return {
                removedMemberName: targetMembership.users.name,
                memberCount: updatedCount,
                status: nextStatus,
            };
        });

        return NextResponse.json({
            message: `${result.removedMemberName} was removed from the group`,
            memberCount: result.memberCount,
            status: result.status,
        });
    } catch (error) {
        console.error("Remove member API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to remove group member" },
            { status: 500 }
        );
    }
}
