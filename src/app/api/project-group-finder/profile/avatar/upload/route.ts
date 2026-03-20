import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { prisma } from "@/lib/prismaClient";

const BUCKET = "avatars";

// POST /api/project-group-finder/profile/avatar/upload
// Accepts multipart form with "file" (image) and "userId"
export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get("file") as File | null;
        const userId = form.get("userId") as string | null;

        if (!file || !userId) {
            return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
        }

        const allowed = ["image/png", "image/jpeg", "image/webp"];
        if (!allowed.includes(file.type)) {
            return NextResponse.json({ error: "Only PNG / JPG / WEBP allowed" }, { status: 400 });
        }

        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: "Max file size is 2 MB" }, { status: 400 });
        }

        const ext = file.name.split(".").pop() ?? "png";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();

        const { error: uploadErr } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, arrayBuffer, { contentType: file.type, upsert: true });

        if (uploadErr) {
            return NextResponse.json({ error: uploadErr.message }, { status: 500 });
        }

        // Build the public URL using Supabase SDK (bucket must be public)
        const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

        // Persist the path in DB
        await (prisma.users as any).update({
            where: { id: userId },
            data: { avatar_path: path },
        });

        return NextResponse.json({ url: data.publicUrl });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
    }
}