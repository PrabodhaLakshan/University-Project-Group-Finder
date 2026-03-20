"use client";

import { useState, useRef, KeyboardEvent } from "react";

const PRESET_SKILLS = [
    "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
    "Python", "Java", "C++", "SQL", "MongoDB", "PostgreSQL",
    "Tailwind CSS", "Git", "Docker", "AWS", "Figma",
];

export default function SkillsSection({
    skills,
    isEditing,
    onSave,
}: {
    skills: string[];
    isEditing: boolean;
    onSave: (skills: string[]) => Promise<void>;
}) {
    const [draft, setDraft] = useState<string[]>(skills);
    const [input, setInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function addSkill(value: string) {
        const trimmed = value.trim();
        if (!trimmed) return;
        // Avoid duplicates (case-insensitive)
        if (draft.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
            setInput("");
            return;
        }
        const next = [...draft, trimmed];
        setDraft(next);
        setInput("");
        setDirty(true);
    }

    function removeSkill(skill: string) {
        const next = draft.filter((s) => s !== skill);
        setDraft(next);
        setDirty(true);
    }

    function handleKey(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill(input);
        } else if (e.key === "Backspace" && input === "" && draft.length > 0) {
            removeSkill(draft[draft.length - 1]);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            await onSave(draft);
            setDirty(false);
        } finally {
            setSaving(false);
        }
    }

    // Filter preset suggestions not already in draft
    const suggestions = PRESET_SKILLS.filter(
        (s) => !draft.some((d) => d.toLowerCase() === s.toLowerCase()) &&
            s.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-cyan-500">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-900">Technical Skills</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                    {isEditing ? "Type a skill and press Enter or comma to add." : "Your skills visible to group members."}
                </p>
            </div>

            <div className="p-5 space-y-3">
                {/* Tag display + input (edit mode) */}
                <div>
                    {/* Chip container */}
                    <div
                        className={[
                            "flex flex-wrap gap-1.5 min-h-[44px] rounded-xl transition",
                            isEditing
                                ? "border-2 border-slate-200 bg-slate-50 p-2 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 cursor-text"
                                : "",
                        ].join(" ")}
                        onClick={() => isEditing && inputRef.current?.focus()}
                    >
                        {draft.map((skill) => (
                            <span
                                key={skill}
                                className={[
                                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition",
                                    isEditing
                                        ? "bg-cyan-100 text-cyan-800 border border-cyan-200"
                                        : "bg-cyan-50 text-cyan-700 border border-cyan-100",
                                ].join(" ")}
                            >
                                {skill}
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                                        className="ml-0.5 rounded-full text-cyan-500 hover:text-red-500 focus:outline-none"
                                        aria-label={`Remove ${skill}`}
                                    >
                                        ×
                                    </button>
                                )}
                            </span>
                        ))}

                        {isEditing && (
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                onBlur={() => { if (input.trim()) addSkill(input); }}
                                placeholder={draft.length === 0 ? "e.g. React, Python…" : ""}
                                className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                            />
                        )}
                    </div>

                    {/* Empty state (view mode) */}
                    {!isEditing && draft.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                    )}

                    {/* Suggestions while typing */}
                    {isEditing && input.length > 0 && suggestions.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => addSkill(s)}
                                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                                >
                                    + {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick-add preset chips (shown when no input and in edit mode) */}
                {isEditing && input === "" && (
                    <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Quick add</p>
                        <div className="flex flex-wrap gap-1.5">
                            {PRESET_SKILLS.filter(
                                (s) => !draft.some((d) => d.toLowerCase() === s.toLowerCase())
                            ).slice(0, 8).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => addSkill(s)}
                                    className="rounded-full border border-dashed border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700"
                                >
                                    + {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Save button */}
                {isEditing && dirty && (
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
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
                            <>💾 Save Skills ({draft.length})</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
