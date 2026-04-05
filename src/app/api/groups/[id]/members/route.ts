import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { appendChatBotMentionMember } from "@/lib/chatBot";

function toAvatarUrl(raw: string | null | undefined): string | null {
    if (!raw) return null;
    const value = raw.trim();
    if (!value) return null;
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
        return value;
    }
    const normalizedPath = value.replace(/\\/g, "/").replace(/^avatars\//, "");
    const { data } = supabaseAdmin.storage.from("avatars").getPublicUrl(normalizedPath);
    return data.publicUrl;
}

function isValidNumericGroupId(groupId: string) {
    return /^[0-9]+$/.test(groupId);
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;

        if (!groupId || groupId === "undefined") {
            return NextResponse.json({ success: false, message: "Invalid group id" }, { status: 400 });
        }
        if (!isValidNumericGroupId(groupId)) {
            return NextResponse.json({ success: false, message: "Invalid group id format" }, { status: 400 });
        }

        // Verify requester is a member
        const membership = await prisma.project_group_members.findUnique({
            where: {
                group_id_user_id: {
                    group_id: BigInt(groupId),
                    user_id: currentUser.id,
                },
            },
        });

        if (!membership) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        // Get all members of this group
        const members = await prisma.project_group_members.findMany({
            where: { group_id: BigInt(groupId) },
            include: {
                users: {
                    select: { id: true, name: true, avatar_path: true },
                },
            },
        });

        const result = members.map((m) => ({
            id: m.users.id,
            name: m.users.name,
            avatar_path: toAvatarUrl(m.users.avatar_path),
        }));

        return NextResponse.json({ success: true, members: appendChatBotMentionMember(result) });
    } catch (error) {
        console.error("GET members error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ success: false, message: "Failed to fetch members" }, { status: 500 });
    }
}
