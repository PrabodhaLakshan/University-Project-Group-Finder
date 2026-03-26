import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Params = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;

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
                { error: "Only group leaders can update group settings" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { name, description, max_members } = body;

        const updatedGroup = await prisma.project_group.update({
            where: { id: BigInt(groupId) },
            data: {
                name: name !== undefined ? name : undefined,
                description: description !== undefined ? description : undefined,
                max_members: max_members !== undefined ? parseInt(max_members) : undefined,
            },
        });

        if (max_members !== undefined) {
            const currentCount = await prisma.project_group_members.count({
                where: { group_id: BigInt(groupId) },
            });

            const newStatus = currentCount >= max_members ? "full" : "active";

            await prisma.project_group.update({
                where: { id: BigInt(groupId) },
                data: { status: newStatus },
            });

            if (newStatus === "full") {
                await prisma.project_group_invites.updateMany({
                    where: {
                        group_id: BigInt(groupId),
                        status: "pending",
                    },
                    data: {
                        status: "cancelled",
                    },
                });
            }
        }

        return NextResponse.json({
            message: "Group updated successfully",
            group: {
                id: updatedGroup.id.toString(),
                name: updatedGroup.name,
                description: updatedGroup.description,
                status: updatedGroup.status,
                max_members: updatedGroup.max_members,
            },
        });
    } catch (error) {
        console.error("Update group API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to update group" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request, { params }: Params) {
    try {
        await requireUserFromRequest(req);
        const { id: groupId } = await params;

        const group = await prisma.project_group.findUnique({
            where: { id: BigInt(groupId) },
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
                                student_id: true,
                                year: true,
                                semester: true,
                                skills: true,
                                bio: true,
                                github_url: true,
                                linkedin_url: true,
                                mobile_no: true,
                            },
                        },
                    },
                },
            },
        });

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json({
            group: {
                id: group.id.toString(),
                name: group.name,
                description: group.description,
                status: group.status,
                max_members: group.max_members,
                created_at: group.created_at,
                members: group.project_group_members.map((member: any) => {
                    let avatarUrl = undefined;
                    if (member.users.avatar_path) {
                        const { data } = supabaseAdmin.storage
                            .from("avatars")
                            .getPublicUrl(member.users.avatar_path);
                        avatarUrl = data.publicUrl;
                    }

                    return {
                        id: member.id.toString(),
                        user_id: member.user_id,
                        role: member.role,
                        joined_at: member.joined_at,
                        user: {
                            ...member.users,
                            avatarUrl,
                        },
                    };
                }),
            },
        });
    } catch (error) {
        console.error("Get group API error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to load group details" },
            { status: 500 }
        );
    }
}
