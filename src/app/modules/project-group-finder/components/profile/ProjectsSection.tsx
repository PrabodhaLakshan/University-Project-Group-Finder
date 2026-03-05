"use client";

import { useState } from "react";
import SectionCard from "./SectionCard";
import EmptyAddCard from "./EmptyAddCard";
import type { ProfileProject } from "@/app/modules/project-group-finder/types";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

function TechBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
      {label}
    </span>
  );
}

function RepoCard({ p, onRemove }: { p: ProfileProject; onRemove: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">📁</span>
          <p className="font-semibold text-slate-900 truncate">{p.name}</p>
        </div>
        <button
          onClick={() => onRemove(p.id)}
          className="flex-shrink-0 rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100 transition"
        >
          Remove
        </button>
      </div>

      {p.description && (
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.description}</p>
      )}

      {/* Tech badges */}
      {p.tech.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>
      )}

      {/* Links + date */}
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
  );
}

export default function ProjectsSection({
  projects,
  onAdd,
  onRemove,
}: {
  projects: ProfileProject[];
  onAdd: (proj: ProfileProject) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState("Next.js, Prisma");
  const [repo, setRepo] = useState("");
  const [live, setLive] = useState("");

  const add = () => {
    if (!name.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: desc.trim() || "No description",
      tech: tech.split(",").map((x) => x.trim()).filter(Boolean),
      repoUrl: repo.trim() || undefined,
      liveUrl: live.trim() || undefined,
      updatedAt: "just now",
    });
    setName(""); setDesc(""); setTech("Next.js, Prisma"); setRepo(""); setLive("");
    setOpen(false);
  };

  return (
    <SectionCard
      title="Personal Projects"
      hint="Showcase your work — add GitHub repo links and tech stacks."
      accent="indigo"
    >
      {/* Add form */}
      {open ? (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-800 mb-1">New Project</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name *" className={inputCls} />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short description"
            rows={2}
            className={inputCls}
          />
          <input
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            placeholder="Tech stack (comma separated e.g. React, Node.js)"
            className={inputCls}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="Repo URL (optional)" className={inputCls} />
            <input value={live} onChange={(e) => setLive(e.target.value)} placeholder="Live URL (optional)" className={inputCls} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={add}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add Project
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          + Add new project
        </button>
      ) : null}

      {/* Empty state */}
      {projects.length === 0 && !open && (
        <EmptyAddCard text="Add your first project." onAdd={() => setOpen(true)} />
      )}

      {/* Project list */}
      {projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((p) => (
            <RepoCard key={p.id} p={p} onRemove={onRemove} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}