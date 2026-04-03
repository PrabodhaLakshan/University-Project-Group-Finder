import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { requireUserFromRequest } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "project-group-resource";
const MAX_LIST_ITEMS = 100;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = {
    document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "text/csv",
        "application/zip",
        "application/x-zip-compressed",
        "application/vnd.rar",
        "application/x-rar-compressed",
    ],
    image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    video: ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"],
} as const;

type ResourceKind = keyof typeof ALLOWED_TYPES;

function isValidNumericGroupId(groupId: string) {
    return /^[0-9]+$/.test(groupId);
}

function sanitizeFileName(fileName: string) {
    return fileName
        .trim()
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function getFileExtension(fileName: string, fallback: string) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ext || fallback;
}

function getFallbackExtension(kind: ResourceKind) {
    if (kind === "image") return "jpg";
    if (kind === "video") return "mp4";
    return "bin";
}

function parseResourcePath(path: string) {
    const [, rawName] = path.split("/");
    if (!rawName) {
        return null;
    }

    const [kind, uploaderId, createdAtRaw, ...nameParts] = rawName.split("__");
    if (!kind || !uploaderId || !createdAtRaw || nameParts.length === 0) {
        return null;
    }

    if (!["document", "image", "video"].includes(kind)) {
        return null;
    }

    return {
        kind: kind as ResourceKind,
        uploaderId,
        createdAt: Number(createdAtRaw) || 0,
        originalName: nameParts.join("__"),
    };
}

async function getMembership(groupId: string, userId: string) {
    return prisma.project_group_members.findUnique({
        where: {
            group_id_user_id: {
                group_id: BigInt(groupId),
                user_id: userId,
            },
        },
    });
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;

        if (!isValidNumericGroupId(groupId)) {
            return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
        }

        const membership = await getMembership(groupId, currentUser.id);
        if (!membership) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { data: files, error } = await supabaseAdmin.storage
            .from(BUCKET)
            .list(groupId, {
                limit: MAX_LIST_ITEMS,
                offset: 0,
                sortBy: { column: "created_at", order: "desc" },
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const resources = await Promise.all(
            (files || [])
                .filter((file) => Boolean(file.name))
                .map(async (file) => {
                    const fullPath = `${groupId}/${file.name}`;
                    const parsed = parseResourcePath(fullPath);
                    if (!parsed) {
                        return null;
                    }

                    const signed = await supabaseAdmin.storage
                        .from(BUCKET)
                        .createSignedUrl(fullPath, 60 * 60);

                    return {
                        name: parsed.originalName,
                        path: fullPath,
                        kind: parsed.kind,
                        size: file.metadata?.size ?? null,
                        createdAt:
                            file.created_at ||
                            (parsed.createdAt ? new Date(parsed.createdAt).toISOString() : null),
                        updatedAt: file.updated_at || null,
                        uploaderId: parsed.uploaderId,
                        url: signed.data?.signedUrl || null,
                        canDelete:
                            membership.role === "leader" || parsed.uploaderId === currentUser.id,
                    };
                })
        );

        return NextResponse.json({
            resources: resources.filter(Boolean),
        });
    } catch (error) {
        console.error("Get project resources error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to load project resources" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;

        if (!isValidNumericGroupId(groupId)) {
            return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
        }

        const membership = await getMembership(groupId, currentUser.id);
        if (!membership) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const form = await req.formData();
        const file = form.get("file") as File | null;
        const kind = form.get("kind") as ResourceKind | null;

        if (!file || !kind || !(kind in ALLOWED_TYPES)) {
            return NextResponse.json(
                { error: "File and valid kind are required" },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES[kind].includes(file.type)) {
            return NextResponse.json(
                { error: `Unsupported ${kind} file format` },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File exceeds the 50 MB limit" },
                { status: 400 }
            );
        }

        const safeName = sanitizeFileName(file.name) || `resource.${getFileExtension(file.name, getFallbackExtension(kind))}`;
        const createdAt = Date.now();
        const path = `${groupId}/${kind}__${currentUser.id}__${createdAt}__${safeName}`;
        const bytes = await file.arrayBuffer();

        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, bytes, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const signed = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUrl(path, 60 * 60);

        return NextResponse.json({
            resource: {
                name: file.name,
                path,
                kind,
                size: file.size,
                createdAt: new Date(createdAt).toISOString(),
                updatedAt: new Date(createdAt).toISOString(),
                uploaderId: currentUser.id,
                url: signed.data?.signedUrl || null,
                canDelete: true,
            },
        });
    } catch (error) {
        console.error("Upload project resource error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to upload project resource" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await requireUserFromRequest(req);
        const { id: groupId } = await params;

        if (!isValidNumericGroupId(groupId)) {
            return NextResponse.json({ error: "Invalid group id" }, { status: 400 });
        }

        const membership = await getMembership(groupId, currentUser.id);
        if (!membership) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { path } = (await req.json()) as { path?: string };
        if (!path || !path.startsWith(`${groupId}/`)) {
            return NextResponse.json({ error: "Invalid resource path" }, { status: 400 });
        }

        const parsed = parseResourcePath(path);
        if (!parsed) {
            return NextResponse.json({ error: "Invalid resource metadata" }, { status: 400 });
        }

        const canDelete = membership.role === "leader" || parsed.uploaderId === currentUser.id;
        if (!canDelete) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete project resource error:", error);

        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(
            { error: "Failed to delete project resource" },
            { status: 500 }
        );
    }
}
