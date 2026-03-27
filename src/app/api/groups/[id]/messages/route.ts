import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type StoredAttachmentPayload = {
    text?: string;
    attachment_type?: "image" | "video" | "voice";
    attachment_bucket?: string;
    attachment_path?: string;
    attachment_name?: string;
};

type GroupMessageRecord = {
    id: string;
    group_id: string;
    sender_id: string;
    sender_name: string | null;
    sender_image: string | null;
    message: string;
    created_at: Date;
};

function toAvatarUrl(raw: string | null | undefined) {
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

function parseStoredPayload(rawMessage: string): StoredAttachmentPayload | null {
    if (!rawMessage || !rawMessage.trim().startsWith("{")) return null;

    try {
        const parsed = JSON.parse(rawMessage) as StoredAttachmentPayload;
        if (typeof parsed !== "object" || parsed === null) return null;
        return parsed;
    } catch {
        return null;
    }
}

async function hydrateMessage(
    record: GroupMessageRecord,
    senderAvatarByUserId?: Map<string, string | null>
) {
    const payload = parseStoredPayload(record.message);
    const hasAttachment =
        !!payload?.attachment_type &&
        !!payload?.attachment_bucket &&
        !!payload?.attachment_path;

    const avatarFromSender = toAvatarUrl(record.sender_image);
    const avatarFromUserMap = toAvatarUrl(senderAvatarByUserId?.get(record.sender_id) || null);
    const resolvedSenderImage = avatarFromUserMap || avatarFromSender;

    if (!hasAttachment) {
        return {
            ...record,
            sender_image: resolvedSenderImage,
            message: record.message,
            attachment_type: null,
            attachment_url: null,
            attachment_name: null,
            attachment_bucket: null,
            attachment_path: null,
            created_at: record.created_at.toISOString(),
        };
    }

    const signed = await supabaseAdmin.storage
        .from(payload!.attachment_bucket!)
        .createSignedUrl(payload!.attachment_path!, 60 * 60);

    return {
        ...record,
        sender_image: resolvedSenderImage,
        message: payload?.text || "",
        attachment_type: payload?.attachment_type || null,
        attachment_url: signed.data?.signedUrl || null,
        attachment_name: payload?.attachment_name || null,
        attachment_bucket: payload?.attachment_bucket || null,
        attachment_path: payload?.attachment_path || null,
        created_at: record.created_at.toISOString(),
    };
}

async function ensureGroupMember(groupId: string, userId: string) {
    const membership = await prisma.project_group_members.findUnique({
        where: {
            group_id_user_id: {
                group_id: BigInt(groupId),
                user_id: userId,
            },
        },
    });

    return !!membership;
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

        if (!groupId || groupId === 'undefined') {
            return NextResponse.json(
                { success: false, message: "Invalid group id" },
                { status: 400 }
            );
        }
        if (!isValidNumericGroupId(groupId)) {
            return NextResponse.json(
                { success: false, message: "Invalid group id format" },
                { status: 400 }
            );
        }

        const isMember = await ensureGroupMember(groupId, currentUser.id);
        if (!isMember) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const messages = await prisma.group_messages.findMany({
            where: {
                group_id: groupId,
            },
            orderBy: {
                created_at: "asc",
            },
        });

        const senderIds = Array.from(
            new Set((messages as unknown as GroupMessageRecord[]).map((m) => m.sender_id).filter(Boolean))
        );
        const senderProfiles = senderIds.length
            ? await prisma.users.findMany({
                where: { id: { in: senderIds } },
                select: { id: true, avatar_path: true },
            })
            : [];
        const senderAvatarByUserId = new Map<string, string | null>(
            senderProfiles.map((u) => [u.id, u.avatar_path || null])
        );

        const hydratedMessages = await Promise.all(
            (messages as unknown as GroupMessageRecord[]).map((message) =>
                hydrateMessage(message, senderAvatarByUserId)
            )
        );

        return NextResponse.json({
            success: true,
            messages: hydratedMessages,
        });
    } catch (error) {
        console.error("GET messages error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch messages",
            },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;

        if (!groupId || groupId === 'undefined') {
            return NextResponse.json(
                { success: false, message: "Invalid group id" },
                { status: 400 }
            );
        }
        if (!isValidNumericGroupId(groupId)) {
            return NextResponse.json(
                { success: false, message: "Invalid group id format" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const {
            sender_id,
            sender_name,
            sender_image,
            message,
            attachment_type,
            attachment_bucket,
            attachment_path,
            attachment_name,
        } = body;

        if (sender_id !== currentUser.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Sender mismatch",
                },
                { status: 403 }
            );
        }

        const isMember = await ensureGroupMember(groupId, currentUser.id);
        if (!isMember) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            );
        }

        const trimmedText = String(message || "").trim();
        const hasAttachment =
            !!attachment_type && !!attachment_bucket && !!attachment_path;

        if (!sender_id || (!trimmedText && !hasAttachment)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "sender_id and message or attachment are required",
                },
                { status: 400 }
            );
        }

        let effectiveSenderImage: string | null = sender_image || null;
        if (!effectiveSenderImage) {
            const sender = await prisma.users.findUnique({
                where: { id: sender_id },
                select: { avatar_path: true },
            });
            effectiveSenderImage = sender?.avatar_path || null;
        }

        const storedMessage = hasAttachment
            ? JSON.stringify({
                text: trimmedText,
                attachment_type,
                attachment_bucket,
                attachment_path,
                attachment_name: attachment_name || null,
            } satisfies StoredAttachmentPayload)
            : trimmedText;

        const newMessage = await prisma.group_messages.create({
            data: {
                id: randomUUID(),
                group_id: groupId,
                sender_id,
                sender_name: sender_name || null,
                sender_image: effectiveSenderImage,
                message: storedMessage,
            },
        });

        const hydrated = await hydrateMessage(newMessage as unknown as GroupMessageRecord);

        return NextResponse.json({
            success: true,
            message: hydrated,
        });
    } catch (error) {
        console.error("POST message error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to save message",
            },
            { status: 500 }
        );
    }
}
