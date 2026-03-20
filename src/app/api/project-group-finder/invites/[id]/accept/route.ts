import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";

type Params = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: inviteId } = await params;

        const invite = await prisma.project_group_invites.findUnique({
            where: { id: inviteId },
        });

        if (!invite) {
            return NextResponse.json({ error: "Invite not found" }, { status: 404 });
        }

        if (invite.receiver_id !== currentUser.id) {
            return NextResponse.json(
                { error: "You are not allowed to accept this invite" },
                { status: 403 }
            );
        }

        if (invite.status !== "pending") {
            return NextResponse.json(
                { error: "This invite is no longer pending" },
                { status: 400 }
            );
        }

        const receiverMembership = await prisma.project_group_members.findUnique({
            where: {
                user_id: currentUser.id,
            },
        });

        if (receiverMembership) {
            return NextResponse.json(
                { error: "You are already in a group. Leave that group first." },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            let targetGroupId: bigint;

            if (invite.group_id) {
                const existingGroup = await tx.project_group.findUnique({
                    where: { id: invite.group_id },
                });

                if (!existingGroup) {
                    throw new Error("Target group not found");
                }

                const currentMemberCount = await tx.project_group_members.count({
                    where: { group_id: invite.group_id },
                });

                const maxMembers = existingGroup.max_members ?? 4;

                if (currentMemberCount >= maxMembers) {
                    await tx.project_group.update({
                        where: { id: invite.group_id },
                        data: { status: "full" },
                    });

                    await tx.project_group_invites.update({
                        where: { id: invite.id },
                        data: { status: "cancelled" },
                    });

                    throw new Error("Group is already full");
                }

                await tx.project_group_members.create({
                    data: {
                        group_id: invite.group_id,
                        user_id: invite.receiver_id,
                        role: "member",
                    },
                });

                targetGroupId = invite.group_id;
            } else {
                const newGroup = await tx.project_group.create({
                    data: {
                        created_by: invite.sender_id,
                        name: null,
                        description: null,
                        status: "active",
                        max_members: 4,
                    },
                });

                await tx.project_group_members.createMany({
                    data: [
                        {
                            group_id: newGroup.id,
                            user_id: invite.sender_id,
                            role: "leader",
                        },
                        {
                            group_id: newGroup.id,
                            user_id: invite.receiver_id,
                            role: "member",
                        },
                    ],
                });

                targetGroupId = newGroup.id;
            }

            // Update Invite Status
            await tx.project_group_invites.update({
                where: { id: invite.id },
                data: {
                    status: "accepted",
                    group_id: targetGroupId,
                },
            });

            // Check if group is now full
            const updatedCount = await tx.project_group_members.count({
                where: { group_id: targetGroupId },
            });

            const targetGroup = await tx.project_group.findUnique({
                where: { id: targetGroupId },
            });

            const maxMembers = targetGroup?.max_members ?? 4;

            if (updatedCount >= maxMembers) {
                await tx.project_group.update({
                    where: { id: targetGroupId },
                    data: { status: "full" },
                });

                await tx.project_group_invites.updateMany({
                    where: {
                        group_id: targetGroupId,
                        status: "pending",
                    },
                    data: {
                        status: "cancelled",
                    },
                });
            }

            return {
                groupId: targetGroupId.toString(),
                memberCount: updatedCount,
                maxMembers,
            };
        });

        return NextResponse.json({
            message: "Invite accepted successfully",
            groupId: result.groupId,
            memberCount: result.memberCount,
            maxMembers: result.maxMembers,
        });
    } catch (error) {
        console.error("Accept invite API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const message =
            error instanceof Error ? error.message : "Failed to accept invite";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}