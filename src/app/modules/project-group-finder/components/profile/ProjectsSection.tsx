"use client";

import { useState, useRef } from "react";
import SectionCard from "./SectionCard";
import EmptyAddCard from "./EmptyAddCard";
import type { ProfileProject } from "@/app/modules/project-group-finder/types";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const DESC_MAX = 150;

function isValidHttpsUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function TechBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
      {label}
    </span>
  );
}

function RepoCard({
  p,
  isEditing,
  onRemove,
}: {
  p: ProfileProject;
  isEditing: boolean;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md overflow-hidden">
      {p.imageUrl && (
        <img
          src={p.imageUrl}
          alt={p.name}
          className="h-36 w-full object-cover"
        />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">📁</span>
            <p className="font-semibold text-slate-900 truncate">{p.name}</p>
          </div>
          {isEditing && (
            <button
              onClick={() => onRemove(p.id)}
              className="flex-shrink-0 rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100 transition"
            >
              Remove
            </button>
          )}
        </div>

        {p.description && (
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.description}</p>
        )}

        {p.tech.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tech.map((t) => (
              <TechBadge key={t} label={t} />
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
          {p.repoUrl && (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              🐙 Repo →
            </a>
          )}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              🔗 Live →
            </a>
          )}
          {p.updatedAt && (
            <span className="ml-auto text-slate-400">Updated {p.updatedAt}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection({
  projects,
  userId,
  isEditing,
  onAdd,
  onRemove,
}: {
  projects: ProfileProject[];
  userId: string;
  isEditing: boolean;
  onAdd: (proj: ProfileProject) => Promise<void>;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState("Next.js, Prisma");
  const [repo, setRepo] = useState("");
  const [live, setLive] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const repoError = repo.trim() && !isValidHttpsUrl(repo) ? "Repo URL must start with https://" : "";
  const liveError = live.trim() && !isValidHttpsUrl(live) ? "Live URL must start with https://" : "";
  const hasLinkErrors = !!repoError || !!liveError;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed.");
      setImageFile(undefined);
      setImagePreview(undefined);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setImageError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setName("");
    setDesc("");
    setTech("Next.js, Prisma");
    setRepo("");
    setLive("");
    setImageFile(undefined);
    setImagePreview(undefined);
    setImageError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function add() {
    if (!name.trim() || hasLinkErrors) return;

    setAdding(true);
    try {
      let imageUrl: string | undefined = undefined;

      if (imageFile && userId) {
        const fd = new FormData();
        fd.append("file", imageFile);
        fd.append("userId", userId);
        const uploadRes = await fetch("/api/project-group-finder/projects/upload-image", {
          method: "POST",
          body: fd,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      await onAdd({
        id: crypto.randomUUID(),
        name: name.trim(),
        description: desc.trim() || "No description",
        tech: tech.split(",").map((x) => x.trim()).filter(Boolean),
        repoUrl: repo.trim() || undefined,
        liveUrl: live.trim() || undefined,
        imageUrl,
        updatedAt: "just now",
      });

      resetForm();
      setOpen(false);
    } finally {
      setAdding(false);
    }
  }

  return (
    <SectionCard
      title="Personal Projects"
      hint="Showcase your work — add GitHub repo links and tech stacks."
      accent="indigo"
    >
      {open ? (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-800 mb-1">New Project</p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name *"
            className={inputCls}
          />

          <div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Short description"
              rows={2}
              maxLength={DESC_MAX}
              className={inputCls}
            />
            <div className="mt-1 flex justify-end">
              <p className="text-xs text-slate-500">
                {desc.length}/{DESC_MAX}
              </p>
            </div>
          </div>

          <input
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            placeholder="Tech stack (comma separated e.g. React, Node.js)"
            className={inputCls}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="Repo URL (optional)"
                className={inputCls}
              />
              {repoError && <p className="mt-1 text-xs text-red-500">{repoError}</p>}
            </div>

            <div>
              <input
                value={live}
                onChange={(e) => setLive(e.target.value)}
                placeholder="Live URL (optional)"
                className={inputCls}
              />
              {liveError && <p className="mt-1 text-xs text-red-500">{liveError}</p>}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-600">Project Image (optional)</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img src={imagePreview} alt="Preview" className="h-36 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(undefined);
                    setImageFile(undefined);
                    setImageError("");
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-red-500 shadow hover:bg-white"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-5 text-sm text-slate-500 transition hover:border-blue-400 hover:text-blue-600"
              >
                🖼️ Click to upload project image
              </button>
            )}
            {imageError && <p className="mt-1 text-xs text-red-500">{imageError}</p>}
          </div>

          <div className="flex gap-2">
            <button
              onClick={add}
              disabled={adding || !name.trim() || hasLinkErrors}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {adding ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </>
              ) : (
                "Add Project"
              )}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={adding}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : isEditing && projects.length > 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          + Add new project
        </button>
      ) : null}

      {projects.length === 0 && !open && (
        isEditing ? (
          <EmptyAddCard text="Add your first project." onAdd={() => setOpen(true)} />
        ) : (
          <p className="text-sm text-slate-400 italic">No projects added yet.</p>
        )
      )}

      {projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((p) => (
            <RepoCard key={p.id} p={p} isEditing={isEditing} onRemove={onRemove} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}