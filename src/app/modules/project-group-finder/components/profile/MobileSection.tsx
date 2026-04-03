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

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function validateSriLankanMobile(value: string) {
  const cleaned = normalizePhone(value.trim());

  if (!cleaned) return "";

  if (!cleaned.startsWith("0")) {
    return "Mobile number must start with 0.";
  }

  if (cleaned.length !== 10) {
    return "Mobile number must be exactly 10 digits.";
  }

  return "";
}

function formatPhoneForSave(value: string) {
  return normalizePhone(value.trim());
}

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

  const error = useMemo(() => validateSriLankanMobile(draft), [draft]);
  const hasError = !!error;

  const handleSave = () => {
    if (hasError) return;

    onSave(formatPhoneForSave(draft));
    setEditing(false);
  };

  return (
    <SectionCard
      title="Mobile Number"
      hint="Optional — makes it easier for teammates to reach you."
      accent="indigo"
    >
      {!mobile && !editing ? (
        isEditing ? (
          <EmptyAddCard text="Add your mobile number." onAdd={() => setEditing(true)} />
        ) : (
          <p className="text-sm text-slate-400 italic">No mobile number added.</p>
        )
      ) : editing ? (
        <div className="space-y-3">
          <div>
            <input
              value={draft}
              onChange={(e) => {
                const next = normalizePhone(e.target.value).slice(0, 10);
                if (next.length > 0 && !next.startsWith("0")) {
                  return;
                }
                setDraft(next);
              }}
              placeholder="07XXXXXXXX"
              type="tel"
              maxLength={10}
              className={`${inputCls} ${hasError ? inputErrorCls : ""}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={hasError}
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
