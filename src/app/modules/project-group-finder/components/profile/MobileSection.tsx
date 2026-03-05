"use client";

import { useState } from "react";
import SectionCard from "./SectionCard";
import EmptyAddCard from "./EmptyAddCard";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const btnPrimary =
  "rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400";

const btnGhost =
  "rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100";

export default function MobileSection({
  mobile,
  isEditing,
  onSave,
}: {
  mobile?: string;
  isEditing: boolean;
  onSave: (mobile: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(mobile || "");

  return (
    <SectionCard title="Mobile Number" hint="Optional — makes it easier for teammates to reach you." accent="indigo">
      {!mobile && !editing ? (
        isEditing ? (
          <EmptyAddCard text="Add your mobile number." onAdd={() => setEditing(true)} />
        ) : (
          <p className="text-sm text-slate-400 italic">No mobile number added.</p>
        )
      ) : editing ? (
        <div className="space-y-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="07XXXXXXXX"
            type="tel"
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
                setDraft(mobile || "");
                setEditing(false);
              }}
              className={btnGhost}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">📱</span>
            <span className="text-sm font-medium text-slate-800">{mobile}</span>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </SectionCard>
  );
}