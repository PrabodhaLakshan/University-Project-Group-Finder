import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "result-sheets-temp";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
    }

    // (Optional) size limit ~ 5MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "PDF too large (max 5MB)" }, { status: 400 });
    }

    // TODO: Replace with your real logged-in user id (from JWT/session)
    // For now: get from form or use a fixed value during dev
    const userId = (form.get("userId") as string) || "dev-user";

    const uploadId = crypto.randomUUID();
    const path = `${userId}/${uploadId}.pdf`;

    // Upload to Supabase Storage (temp)
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    // Create short-lived signed URL for Python to fetch
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 5); // 5 minutes

    if (signErr || !signed?.signedUrl) {
      return NextResponse.json({ error: signErr?.message || "Signed URL failed" }, { status: 500 });
    }

    // Call Python service
    const pdfService = process.env.PDF_SERVICE_URL;
    if (!pdfService) {
      await supabaseAdmin.storage.from(BUCKET).remove([path]);
      return NextResponse.json(
        { error: "PDF_SERVICE_URL is not configured" },
        { status: 500 }
      );
    }

    let verifyRes: Response;
    try {
      verifyRes = await fetch(`${pdfService}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_url: signed.signedUrl,
          template_version: "v1",
        }),
      });
    } catch (error: any) {
      await supabaseAdmin.storage.from(BUCKET).remove([path]);
      return NextResponse.json(
        {
          error: "PDF verification service is unreachable",
          details: error?.message || "Connection failed",
        },
        { status: 503 }
      );
    }

    let verifyJson: any = null;
    try {
      verifyJson = await verifyRes.json();
    } catch {
      verifyJson = null;
    }

    // OPTIONAL: Delete file after verification (matches your “don’t store pdf” rule)
    await supabaseAdmin.storage.from(BUCKET).remove([path]);

    if (!verifyRes.ok) {
      return NextResponse.json(
        {
          error: "Verification failed",
          details: verifyJson?.detail || verifyJson || "Unknown verification error",
        },
        { status: verifyRes.status >= 400 && verifyRes.status < 600 ? verifyRes.status : 400 }
      );
    }

    // ✅ Return extracted marks to UI (NOT saving to DB yet)
    return NextResponse.json({
      uploadId,
      verified: verifyJson.verified,
      score: verifyJson.score,
      reasons: verifyJson.reasons,
      extractedMarks: verifyJson.extractedMarks,
      gpa: verifyJson.gpa,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
