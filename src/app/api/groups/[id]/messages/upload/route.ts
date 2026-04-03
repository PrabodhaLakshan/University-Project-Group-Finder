import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUserFromRequest } from "@/lib/auth-server";
import { prisma } from "@/lib/prismaClient";

const BUCKET_BY_TYPE = {
    image: "project-group-chat-images",
    video: "group-chat-videos",
    voice: "group-chat-voice",
} as const;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const VOICE_TYPES = ["audio/webm", "audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"];

const MAX_SIZE_BY_TYPE = {
    image: 8 * 1024 * 1024,
    video: 50 * 1024 * 1024,
    voice: 15 * 1024 * 1024,
} as const;

function getExtension(name: string, fallback: string) {
    const ext = name.split(".").pop()?.toLowerCase();
    return ext || fallback;
}

function isAllowedType(kind: "image" | "video" | "voice", mimeType: string) {
    if (kind === "image") return IMAGE_TYPES.includes(mimeType);
    if (kind === "video") return VIDEO_TYPES.includes(mimeType);
    return VOICE_TYPES.includes(mimeType);
}

function isValidNumericGroupId(groupId: string) {
    return /^[0-9]+$/.test(groupId);
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;

        if (!groupId || groupId === "undefined") {
            return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
        }
        if (!isValidNumericGroupId(groupId)) {
            return NextResponse.json({ error: "Invalid group id format" }, { status: 400 });
        }

        const membership = await prisma.project_group_members.findUnique({
            where: {
                group_id_user_id: {
                    group_id: BigInt(groupId),
                    user_id: currentUser.id,
                },
            },
        });

        if (!membership) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const form = await req.formData();
        const file = form.get("file") as File | null;
        const kind = form.get("kind") as "image" | "video" | "voice" | null;

        if (!file || !kind || !(kind in BUCKET_BY_TYPE)) {
            return NextResponse.json({ error: "Missing file or kind" }, { status: 400 });
        }

        if (!isAllowedType(kind, file.type)) {
            return NextResponse.json({ error: `Unsupported ${kind} format` }, { status: 400 });
        }

        const maxBytes = MAX_SIZE_BY_TYPE[kind];
        if (file.size > maxBytes) {
            return NextResponse.json(
                { error: `${kind} exceeds size limit` },
                { status: 400 }
            );
        }

        const extFallback = kind === "image" ? "jpg" : kind === "video" ? "mp4" : "webm";
        const ext = getExtension(file.name, extFallback);
        const path = `${groupId}/${currentUser.id}/${crypto.randomUUID()}.${ext}`;
        const bucket = BUCKET_BY_TYPE[kind];

        const bytes = await file.arrayBuffer();
        const { error: uploadError } = await supabaseAdmin.storage
            .from(bucket)
            .upload(path, bytes, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const signed = await supabaseAdmin.storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60);

        return NextResponse.json({
            success: true,
            attachment: {
                kind,
                name: file.name,
                bucket,
                path,
                signedUrl: signed.data?.signedUrl || null,
            },
        });
    } catch (error) {
        console.error("Upload group chat media error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
