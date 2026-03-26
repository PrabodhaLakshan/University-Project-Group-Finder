"use client";

import { useState } from "react";

export type AcademicInfoData = {
    specialization?: string;
    year?: number;
    semester?: number;
    groupNumber?: string;
};

const SPECIALIZATIONS = [
    "IT",
    "Software Engineering (SE)",
    "Data Science (DS)",
    "Cyber Security (CSNE)",
    "Interactive Media (IM)",
    "Information Systems (IS)",
    "Computer Systems & Network Engineering (CSNE)",
    "Business Management",
    "Engineering",
    "Other",
];

const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2];

export default function AcademicInfoSection({
    data,
    isEditing,
    onSave,
}: {
    data: AcademicInfoData;
    isEditing: boolean;
    onSave: (info: AcademicInfoData) => Promise<void>;
}) {
    const [draft, setDraft] = useState<AcademicInfoData>(data);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    // Sync draft when data changes props
    // React.useEffect(() => setDraft(data), [data]);

    const hasContent = !!data.specialization || !!data.year || !!data.semester || !!data.groupNumber;

    async function handleSave() {
        setSaving(true);
        try {
            await onSave(draft);
            setDirty(false);
        } finally {
            setSaving(false);
        }
    }

    function handleChange(field: keyof AcademicInfoData, val: any) {
        setDraft((prev) => ({ ...prev, [field]: val }));
        setDirty(true);
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-900">Academic Information</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                    Your degree program, batch year, and intended project group.
                </p>
            </div>

            <div className="p-5">
                {!isEditing ? (
                    /* View Mode */
                    <div className="grid gap-4 sm:grid-cols-2">
                        {!hasContent ? (
                            <p className="text-sm italic text-slate-400 sm:col-span-2">No academic info added yet.</p>
                        ) : (
                            <>
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Degree Specialization</p>
                                    <p className="text-sm font-semibold text-slate-900">{data.specialization || "—"}</p>
                                </div>

                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Year / Semester</p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {data.year ? `Year ${data.year}` : "—"}
                                        {data.semester ? ` • Semester ${data.semester}` : ""}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Project Group Number</p>
                                    <p className="text-sm font-semibold text-slate-900">{data.groupNumber || "—"}</p>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    /* Edit Mode */
                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Specialization
                                </label>
                                <select
                                    value={draft.specialization || ""}
                                    onChange={(e) => handleChange("specialization", e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select Specialization</option>
                                    {SPECIALIZATIONS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Year
                                </label>
                                <select
                                    value={draft.year || ""}
                                    onChange={(e) => handleChange("year", e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select Year</option>
                                    {YEARS.map((y) => (
                                        <option key={y} value={y}>Year {y}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Semester
                                </label>
                                <select
                                    value={draft.semester || ""}
                                    onChange={(e) => handleChange("semester", e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select Semester</option>
                                    {SEMESTERS.map((s) => (
                                        <option key={s} value={s}>Semester {s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Project Group Number (e.g., 8 or 8.1)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 8.1"
                                    value={draft.groupNumber || ""}
                                    onChange={(e) => handleChange("groupNumber", e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {dirty && (
                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="inline-flex min-w-[100px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                                >
                                    {saving ? (
                                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                    ) : null}
                                    {saving ? "Saving..." : "Save Academic Info"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
