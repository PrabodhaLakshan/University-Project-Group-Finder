import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function writeLocalBuffer(file: File, buffer: Buffer, folder: string) {
  const ext = path.extname(file.name || "") || ".bin";
  const base = sanitizeFileName(path.basename(file.name || "upload", ext));
  const unique = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const fileName = `${base}-${unique}${ext}`;

  const relativeDir = path.join("uploads", "startup-connect", folder);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(absoluteDir, { recursive: true });

  const absolutePath = path.join(absoluteDir, fileName);
  await writeFile(absolutePath, buffer);

  return `/${relativeDir.replace(/\\/g, "/")}/${fileName}`;
}

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function trySupabaseUpload(bucket: string, file: File, buffer: Buffer) {
  const supabase = supabaseAdmin();
  if (!supabase) return null;

  const ext = path.extname(file.name || "") || ".bin";
  const base = sanitizeFileName(path.basename(file.name || "upload", ext));
  const unique = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const objectPath = `${base}-${unique}${ext}`;
  const contentType =
    file.type && file.type.length > 0 ? file.type : "application/octet-stream";

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType,
    upsert: false,
  });
  if (error) {
    console.error("SUPABASE_STORAGE_UPLOAD:", bucket, error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

const LOGO_BUCKET = process.env.SUPABASE_STARTUP_LOGO_BUCKET ?? "startup-logo";
const CERT_BUCKET = process.env.SUPABASE_STARTUP_CERT_BUCKET ?? "startup-certificate";

/** Generic local save (gig applications, recent works, legacy paths). */
export async function saveUploadedFile(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return writeLocalBuffer(file, buffer, folder);
}

/** Startup profile / register — prefers Supabase bucket `startup-logo`, else local `startup-logo` folder. */
export async function saveStartupLogo(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const remote = await trySupabaseUpload(LOGO_BUCKET, file, buffer);
  if (remote) return remote;
  return writeLocalBuffer(file, buffer, "startup-logo");
}

/** Startup profile / register — prefers Supabase bucket `startup-certificate`, else local `startup-certificate` folder. */
export async function saveStartupCertificate(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const remote = await trySupabaseUpload(CERT_BUCKET, file, buffer);
  if (remote) return remote;
  return writeLocalBuffer(file, buffer, "startup-certificate");
}
