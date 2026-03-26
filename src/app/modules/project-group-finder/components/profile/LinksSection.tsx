"use client";

import { useMemo, useState } from "react";
import SectionCard from "./SectionCard";
import EmptyAddCard from "./EmptyAddCard";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const inputErrorCls =
  "border-red-400 focus:border-red-400 focus:ring-red-100";

const btnPrimary =
  "rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50";

const btnGhost =
  "rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100";

function LinkRow({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50 group"
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1 min-w-0 text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate">
        {label}
      </span>
      <span className="text-xs text-slate-400 group-hover:text-blue-500">→</span>
    </a>
  );
}

function validateUrl(value: string, allowedHost: string) {
  if (!value.trim()) return "";

  try {
    const url = new URL(value.trim());

    if (url.protocol !== "https:") {
      return "Use an HTTPS link.";
    }

    const host = url.hostname.replace(/^www\./, "");

    if (host !== allowedHost) {
      return `Please enter a valid ${allowedHost} URL.`;
    }

    return "";
  } catch {
    return "Please enter a valid URL.";
  }
}

export default function LinksSection({
  githubUrl,
  linkedinUrl,
  isEditing,
  onSave,
}: {
  githubUrl?: string;
  linkedinUrl?: string;
  isEditing: boolean;
  onSave: (data: { githubUrl?: string; linkedinUrl?: string }) => void;
}) {
  const hasAny = !!githubUrl || !!linkedinUrl;
  const [editing, setEditing] = useState(false);
  const [gh, setGh] = useState(githubUrl || "");
  const [li, setLi] = useState(linkedinUrl || "");

  const githubError = useMemo(() => validateUrl(gh, "github.com"), [gh]);
  const linkedinError = useMemo(() => validateUrl(li, "linkedin.com"), [li]);

  const hasErrors = !!githubError || !!linkedinError;

  const handleSave = () => {
    if (hasErrors) return;

    onSave({
      githubUrl: gh.trim() || undefined,
      linkedinUrl: li.trim() || undefined,
    });

    setEditing(false);
  };

  return (
    <SectionCard title="Links" hint="Add your GitHub and LinkedIn profiles." accent="indigo">
      {!hasAny && !editing ? (
        isEditing ? (
          <EmptyAddCard text="Add GitHub / LinkedIn links." onAdd={() => setEditing(true)} />
        ) : (
          <p className="text-sm text-slate-400 italic">No links added yet.</p>
        )
      ) : editing ? (
        <div className="space-y-3">
          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">🐙</span>
              <input
                value={gh}
                onChange={(e) => setGh(e.target.value)}
                placeholder="https://github.com/username"
                className={`${inputCls} pl-9 ${githubError ? inputErrorCls : ""}`}
              />
            </div>
            {githubError && (
              <p className="mt-1 text-xs text-red-500">{githubError}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">💼</span>
              <input
                value={li}
                onChange={(e) => setLi(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className={`${inputCls} pl-9 ${linkedinError ? inputErrorCls : ""}`}
              />
            </div>
            {linkedinError && (
              <p className="mt-1 text-xs text-red-500">{linkedinError}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={hasErrors}
              className={btnPrimary}
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => {
                setGh(githubUrl || "");
                setLi(linkedinUrl || "");
                setEditing(false);
              }}
              className={btnGhost}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {githubUrl && <LinkRow icon="🐙" label={githubUrl} href={githubUrl} />}
          {linkedinUrl && <LinkRow icon="💼" label={linkedinUrl} href={linkedinUrl} />}
          {isEditing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              ✏️ Edit links
            </button>
          )}
        </div>
      )}
    </SectionCard>
  );
}