import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";

export async function POST(req: Request) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const senderId = currentUser.id;

        const body = await req.json();
        const { receiverId } = body;

        if (!receiverId) {
            return NextResponse.json(
                { error: "Receiver ID is required" },
                { status: 400 }
            );
        }

        if (senderId === receiverId) {
            return NextResponse.json(
                { error: "You cannot invite yourself" },
                { status: 400 }
            );
        }

        const senderMembership = await prisma.project_group_members.findUnique({
            where: { user_id: senderId },
            include: { project_group: true },
        });

        if (senderMembership?.project_group) {
            const currentMemberCount = await prisma.project_group_members.count({
                where: {
                    group_id: senderMembership.group_id,
                },
            });

            const maxMembers = senderMembership.project_group.max_members ?? 4;

            if (currentMemberCount >= maxMembers) {
                await prisma.project_group.update({
                    where: { id: senderMembership.group_id },
                    data: { status: "full" },
                });

                return NextResponse.json(
                    { error: "Your group is already full" },
                    { status: 400 }
                );
            }

            const receiverInSameGroup = await prisma.project_group_members.findFirst({
                where: {
                    user_id: receiverId,
                    group_id: senderMembership.group_id,
                },
            });

            if (receiverInSameGroup) {
                return NextResponse.json(
                    { error: "This user is already in your group" },
                    { status: 400 }
                );
            }
        }

        const receiverMembership = await prisma.project_group_members.findUnique({
            where: { user_id: receiverId },
        });

        if (receiverMembership) {
            return NextResponse.json(
                { error: "This user is already in another group" },
                { status: 400 }
            );
        }

        const existingInvite = await prisma.project_group_invites.findFirst({
            where: {
                sender_id: senderId,
                receiver_id: receiverId,
                status: "pending",
            },
        });

        if (existingInvite) {
            return NextResponse.json(
                { error: "Invite already sent" },
                { status: 400 }
            );
        }

        const reverseInvite = await prisma.project_group_invites.findFirst({
            where: {
                sender_id: receiverId,
                receiver_id: senderId,
                status: "pending",
            },
        });

        if (reverseInvite) {
            return NextResponse.json(
                { error: "This user has already invited you. Review that invite instead." },
                { status: 400 }
            );
        }

        const invite = await prisma.project_group_invites.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                group_id: senderMembership?.group_id ?? null,
                status: "pending",
            },
        });

        return NextResponse.json({
            message: "Invite sent successfully",
            invite: {
                id: invite.id.toString(),
                sender_id: invite.sender_id,
                receiver_id: invite.receiver_id,
                group_id: invite.group_id?.toString() ?? null,
                status: invite.status,
                created_at: invite.created_at,
            },
        });
    } catch (error) {
        console.error("Invite API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to send invite" },
            { status: 500 }
        );
    }
}