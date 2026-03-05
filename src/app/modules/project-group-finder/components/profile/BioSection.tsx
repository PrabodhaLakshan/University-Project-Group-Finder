"use client";

import { useState } from "react";
import SectionCard from "./SectionCard";
import EmptyAddCard from "./EmptyAddCard";

/* Shared light input style */
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed";

const btnPrimary =
  "rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1";

const btnGhost =
  "rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100";

export default function BioSection({
  bio,
  isEditing,
  onSave,
}: {
  bio?: string;
  isEditing: boolean;
  onSave: (bio: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bio || "");

  return (
    <SectionCard title="Bio" hint="Write a short intro — think of it as your portfolio summary.">
      {!bio && !editing ? (
        isEditing ? (
          <EmptyAddCard text="Add a short bio about yourself." onAdd={() => setEditing(true)} />
        ) : (
          <p className="text-sm text-slate-400 italic">No bio added yet.</p>
        )
      ) : editing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="I'm a 2nd-year IT student focusing on web development and machine learning..."
            className={inputCls}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onSave(draft.trim());
                setEditing(false);
              }}
              className={btnPrimary}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(bio || "");
                setEditing(false);
              }}
              className={btnGhost}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{bio}</p>
          {isEditing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              ✏️ Edit bio
            </button>
          )}
        </div>
      )}
    </SectionCard>
  );
}