import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";

type Params = {
    params: Promise<{ id: string }>;
};

export async function DELETE(req: Request, { params }: Params) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;
        const parsedGroupId = BigInt(groupId);

        const membership = await prisma.project_group_members.findUnique({
            where: {
                group_id_user_id: {
                    group_id: parsedGroupId,
                    user_id: currentUser.id,
                },
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "You are not a member of this group" },
                { status: 404 }
            );
        }

        const memberCount = await prisma.project_group_members.count({
            where: { group_id: parsedGroupId },
        });

        const result = await prisma.$transaction(async (tx) => {
            if (memberCount === 1) {
                await tx.project_group.delete({
                    where: { id: parsedGroupId },
                });

                return {
                    deletedGroup: true,
                    promotedLeaderName: null,
                };
            }

            let promotedLeaderName: string | null = null;

            if (membership.role === "leader") {
                const nextLeader = await tx.project_group_members.findFirst({
                    where: {
                        group_id: parsedGroupId,
                        user_id: { not: currentUser.id },
                    },
                    include: {
                        users: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        joined_at: "asc",
                    },
                });

                if (nextLeader) {
                    await tx.project_group_members.update({
                        where: {
                            group_id_user_id: {
                                group_id: parsedGroupId,
                                user_id: nextLeader.user_id,
                            },
                        },
                        data: {
                            role: "leader",
                        },
                    });

                    promotedLeaderName = nextLeader.users.name;
                }
            }

            await tx.project_group_members.delete({
                where: {
                    group_id_user_id: {
                        group_id: parsedGroupId,
                        user_id: currentUser.id,
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
                deletedGroup: false,
                promotedLeaderName,
            };
        });

        return NextResponse.json({
            message: result.deletedGroup
                ? "You left the group. The empty group was removed."
                : result.promotedLeaderName
                    ? `You left the group successfully. ${result.promotedLeaderName} is now the leader.`
                    : "You left the group successfully",
        });
    } catch (error) {
        console.error("Leave group API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to leave group" },
            { status: 500 }
        );
    }
}
