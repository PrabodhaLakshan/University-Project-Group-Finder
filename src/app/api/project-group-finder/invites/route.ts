import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
    try {
        const currentUser = await requireUserFromRequest(req);

        const invites = await prisma.project_group_invites.findMany({
            where: {
                OR: [
                    { receiver_id: currentUser.id },
                    { sender_id: currentUser.id },
                ],
                status: "pending",
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                users_project_group_invites_sender_idTousers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        specialization: true,
                        year: true,
                        semester: true,
                        avatar_path: true,
                        github_url: true,
                        linkedin_url: true,
                        skills: true,
                    },
                },
                users_project_group_invites_receiver_idTousers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        specialization: true,
                        year: true,
                        semester: true,
                        avatar_path: true,
                        github_url: true,
                        linkedin_url: true,
                        skills: true,
                    },
                },
                project_group: {
                    include: {
                        project_group_members: {
                            include: {
                                users: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatar_path: true,
                                        specialization: true,
                                        year: true,
                                        semester: true,
                                        skills: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const getAvatarUrl = (avatarPath: string | null) => {
            if (!avatarPath) return null;

            const { data } = supabaseAdmin.storage
                .from("avatars")
                .getPublicUrl(avatarPath);

            return data.publicUrl;
        };

        return NextResponse.json({
            invites: invites.map((invite: any) => ({
                id: invite.id.toString(),
                status: invite.status,
                created_at: invite.created_at,
                group_id: invite.group_id?.toString() ?? null,
                type: invite.sender_id === currentUser.id ? "sent" : "received",
                sender: {
                    ...invite.users_project_group_invites_sender_idTousers,
                    avatar_url: getAvatarUrl(invite.users_project_group_invites_sender_idTousers.avatar_path),
                },
                receiver: invite.users_project_group_invites_receiver_idTousers
                    ? {
                        ...invite.users_project_group_invites_receiver_idTousers,
                        avatar_url: getAvatarUrl(invite.users_project_group_invites_receiver_idTousers.avatar_path),
                    }
                    : null,
                group: invite.project_group
                    ? {
                        id: invite.project_group.id.toString(),
                        name: invite.project_group.name,
                        description: invite.project_group.description,
                        status: invite.project_group.status,
                        max_members: invite.project_group.max_members,
                        members: invite.project_group.project_group_members.map((member: any) => ({
                            id: member.id.toString(),
                            user_id: member.user_id,
                            role: member.role,
                            joined_at: member.joined_at,
                            user: {
                                ...member.users,
                                avatarUrl: getAvatarUrl(member.users.avatar_path),
                            },
                        })),
                    }
                    : null,
            })),
        });
    } catch (error) {
        console.error("Get invites API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to load invites" },
            { status: 500 }
        );
    }
}
