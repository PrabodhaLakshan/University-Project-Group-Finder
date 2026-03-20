import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "project-images";

// POST /api/project-group-finder/projects/upload-image
// Accepts multipart form with "file" (image) and "userId"
export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const file = form.get("file") as File | null;
        const userId = (form.get("userId") as string) || "unknown";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Only JPEG, PNG, WEBP or GIF images are allowed" }, { status: 400 });
        }

        const maxBytes = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxBytes) {
            return NextResponse.json({ error: "Image too large (max 5 MB)" }, { status: 400 });
        }

        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();

        const { error: uploadErr } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, arrayBuffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadErr) {
            return NextResponse.json({ error: uploadErr.message }, { status: 500 });
        }

        const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

        return NextResponse.json({ url: data.publicUrl });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
    }
}
