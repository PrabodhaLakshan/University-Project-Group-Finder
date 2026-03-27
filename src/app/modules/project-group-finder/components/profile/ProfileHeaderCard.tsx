"use client";

import { useRef, useState } from "react";
import type { StudentProfile } from "@/app/modules/project-group-finder/types";

async function uploadAvatar(file: File, userId: string): Promise<{ url?: string; error?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("userId", userId);
  const res = await fetch("/api/project-group-finder/profile/avatar/upload", {
    method: "POST",
    body: fd,
  });
  return res.json();
}

export default function ProfileHeaderCard({
  profile,
  showMore,
  onToggle,
  onImageChange,
}: {
  profile: StudentProfile;
  showMore: boolean;
  onToggle: () => void;
  onImageChange?: (newUrl: string) => void;
}) {
  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* ---------- modal state ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function openModal() {
    setPreview(null);
    setSelectedFile(null);
    setUploadError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setPreview(null);
    setSelectedFile(null);
    setUploadError(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setUploadError(null);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    if (!profile.id) {
      setUploadError("User ID is missing — please refresh and try again.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    const result = await uploadAvatar(selectedFile, profile.id);
    setUploading(false);
    if (result.error || !result.url) {
      setUploadError(result.error ?? "Upload failed.");
      return;
    }
    onImageChange?.(result.url);
    closeModal();
  }

  /* ---------- render ---------- */
  return (
    <>
      <div 
        className="relative overflow-hidden rounded-2xl border border-blue-100 shadow-sm p-6 sm:p-8"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(239, 246, 255, 0.85), rgba(248, 250, 252, 0.95)), url('/images/project-group-finder/group-finder-ui-background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Clickable avatar */}
            <button
              onClick={openModal}
              title="Change profile photo"
              className="group relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-md bg-blue-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {profile.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt=""
                  src={profile.imageUrl}
                  className="absolute inset-0 h-full w-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600">{initials}</span>
              )}
              {/* Hover overlay */}
              <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </button>

            <div className="min-w-0">
              <p className="text-2xl font-bold text-slate-900 truncate">{profile.fullName}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800 bg-white/60 px-2.5 py-0.5 rounded-full border border-blue-200/50 shadow-sm">
                  {profile.studentId}
                </span>
                <span className="font-medium">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Show more / less toggle button */}
          <button
            onClick={onToggle}
            className="flex-shrink-0 rounded-xl border border-blue-200/60 bg-white/80 backdrop-blur px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-white transition sm:self-center self-start"
          >
            {showMore ? "Show less" : "Show more details"}
          </button>
        </div>
      </div>

      {/* ── UPLOAD MODAL ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-slate-900">Update Profile Photo</p>
              <button onClick={closeModal} className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview */}
            <div
              className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50 flex items-center justify-center cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : profile.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.imageUrl} alt="Current" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-blue-400">{initials}</span>
              )}
            </div>

            {/* File input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition mb-1"
            >
              {selectedFile ? selectedFile.name : "Choose image (PNG / JPG / WEBP, max 2 MB)"}
            </button>

            {uploadError && (
              <p className="mt-2 text-xs text-red-600 font-medium">{uploadError}</p>
            )}

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {uploading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {uploading ? "Uploading…" : "Save Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}