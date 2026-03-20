"use client";

import { useState } from "react";

export type GroupStatus = "NO_GROUP" | "PENDING" | "IN_GROUP";

const OPTIONS: { value: GroupStatus; label: string; icon: string; desc: string; color: string; ring: string; bg: string }[] = [
    {
        value: "NO_GROUP",
        label: "No Group",
        icon: "👤",
        desc: "Open to joining a project group",
        color: "text-slate-700",
        ring: "ring-slate-400",
        bg: "bg-slate-50 border-slate-300",
    },
    {
        value: "PENDING",
        label: "Pending",
        icon: "⏳",
        desc: "Looking for or awaiting a group",
        color: "text-amber-700",
        ring: "ring-amber-400",
        bg: "bg-amber-50 border-amber-300",
    },
    {
        value: "IN_GROUP",
        label: "In Group",
        icon: "🤝",
        desc: "Already part of a project group",
        color: "text-green-700",
        ring: "ring-green-400",
        bg: "bg-green-50 border-green-300",
    },
];

export default function GroupStatusSection({
    status,
    isEditing,
    onSave,
}: {
    status: GroupStatus;
    isEditing: boolean;
    onSave: (s: GroupStatus) => Promise<void>;
}) {
    const [draft, setDraft] = useState<GroupStatus>(status);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    const current = OPTIONS.find((o) => o.value === status) ?? OPTIONS[0];

    async function handleSave() {
        setSaving(true);
        try {
            await onSave(draft);
            setDirty(false);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-purple-500">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-900">Group Status</h3>
                <p className="mt-0.5 text-xs text-slate-500">Let teammates know if you're looking for a group.</p>
            </div>

            <div className="p-5 space-y-3">
                {/* Display mode */}
                {!isEditing ? (
                    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${current.bg}`}>
                        <span className="text-xl">{current.icon}</span>
                        <div>
                            <p className={`text-sm font-semibold ${current.color}`}>{current.label}</p>
                            <p className="text-xs text-slate-500">{current.desc}</p>
                        </div>
                    </div>
                ) : (
                    /* Edit mode — 3 option cards */
                    <div className="space-y-2">
                        {OPTIONS.map((opt) => {
                            const selected = draft === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { setDraft(opt.value); setDirty(opt.value !== status); }}
                                    className={[
                                        "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition focus:outline-none",
                                        selected
                                            ? `${opt.bg} ring-2 ${opt.ring} border-transparent`
                                            : "border-slate-200 bg-white hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <span className="text-xl">{opt.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold ${selected ? opt.color : "text-slate-700"}`}>
                                            {opt.label}
                                        </p>
                                        <p className="text-xs text-slate-500">{opt.desc}</p>
                                    </div>
                                    {selected && (
                                        <svg className={`h-4 w-4 flex-shrink-0 ${opt.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}

                        {/* Save button — only visible when selection changed */}
                        {dirty && (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Saving…
                                    </>
                                ) : (
                                    "Save Status"
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
