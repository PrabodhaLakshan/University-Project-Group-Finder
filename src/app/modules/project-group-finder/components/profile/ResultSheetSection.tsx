"use client";

import * as React from "react";
import SectionCard from "./SectionCard";
import EmptyAddCard from "./EmptyAddCard";
import type { Mark, ResultSheetState } from "@/app/modules/project-group-finder/types";

function GradeBadge({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    "A+": "bg-emerald-50 text-emerald-700 border-emerald-200",
    A: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "A-": "bg-green-50 text-green-700 border-green-200",
    "B+": "bg-blue-50 text-blue-700 border-blue-200",
    B: "bg-blue-50 text-blue-700 border-blue-200",
    "B-": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "C+": "bg-amber-50 text-amber-700 border-amber-200",
    C: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const cls = colorMap[grade] ?? "bg-slate-50 text-slate-600 border-slate-200";
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${cls}`}>{grade}</span>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "VERIFIED")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
        ✓ Verified
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        ⏳ Processing
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
      ✗ Rejected
    </span>
  );
}

// ✅ Convert "Y1S1" -> "Year 1 – Semester 1"
function formatSemesterLabel(raw?: string | null) {
  if (!raw) return "Unknown Semester";
  const s = raw.trim();
  if (s.toLowerCase() === "unknown" || s === "—") return "Unknown Semester";

  const m = /^Y\s*(\d+)\s*S\s*(\d+)$/i.exec(s);
  if (m) return `Year ${m[1]} – Semester ${m[2]}`;

  // If it is already something else, keep it
  return s;
}

// ✅ Sort: Y1S1, Y1S2, Y2S1...
function semesterSortKey(raw?: string | null) {
  if (!raw) return [999, 999] as const;
  const m = /^Y\s*(\d+)\s*S\s*(\d+)$/i.exec(raw.trim());
  if (!m) return [998, 998] as const;
  return [Number(m[1]), Number(m[2])] as const;
}

export default function ResultSheetSection({
  state,
  publishedKeySet,
  onTogglePublish,
  onPublishSave,
  setState,
  isEditing,
}: {
  state: ResultSheetState;
  publishedKeySet: Set<string>;
  onTogglePublish: (mark: Mark, enabled: boolean) => void;
  onPublishSave: () => void;
  setState: React.Dispatch<React.SetStateAction<ResultSheetState>>;
  isEditing: boolean;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const hasMarks = state.allMarks.length > 0;
  const keyOf = (m: Mark) => `${m.moduleCode}-${m.marks}-${m.grade}`;

  function openFilePicker() {
    fileRef.current?.click();
  }

  async function uploadFile(file: File) {
    setState((s) => ({ ...s, status: "PENDING", fileName: file.name, allMarks: [], publishedMarks: [] }));
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/project-group-finder/results/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setState((s) => ({ ...s, status: "REJECTED", allMarks: [] }));
        return;
      }

      const marks: Mark[] = (data.extractedMarks ?? []).map((m: any) => ({
        moduleCode: m.moduleCode,
        moduleName: m.moduleName,
        marks: m.marks,
        grade: m.grade,
        semester: m.semester ?? m.semesterTag ?? m.semester_name ?? null,
      }));

      setState((s) => ({
        ...s,
        status: data.verified ? "VERIFIED" : "REJECTED",
        fileName: file.name,
        allMarks: marks,
        gpa: data.gpa,
      }));
    } catch {
      setState((s) => ({ ...s, status: "REJECTED", allMarks: [], gpa: null }));
    }
  }

  // ✅ Group marks by semester tag (e.g., Y1S1)
  const grouped = React.useMemo(() => {
    const map = new Map<string, Mark[]>();
    for (const m of state.allMarks) {
      const key = (m.semester && m.semester !== "—") ? String(m.semester) : "Unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }

    // Sort within each group by module code
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => (a.moduleCode || "").localeCompare(b.moduleCode || ""));
      map.set(k, list);
    }

    // Sort group keys by Year/Semester
    const keys = Array.from(map.keys()).sort((a, b) => {
      const [ay, as] = semesterSortKey(a);
      const [by, bs] = semesterSortKey(b);
      if (ay !== by) return ay - by;
      return as - bs;
    });

    return { map, keys };
  }, [state.allMarks]);

  return (
    <SectionCard
      title="Official Mark Sheet"
      hint="Upload your official result sheet (PDF). System validates and extracts marks — you choose what to publish."
      accent="green"
    >
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f);
          e.currentTarget.value = "";
        }}
      />

      {state.status === "EMPTY" ? (
        isEditing ? (
          <EmptyAddCard text="Upload your official mark sheet (PDF)." onAdd={openFilePicker} />
        ) : (
          <p className="text-sm text-slate-400 italic">No mark sheet uploaded yet.</p>
        )
      ) : (
        <div className="space-y-4">
          {/* File info bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl">📄</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{state.fileName || "Uploaded file"}</p>
                <div className="mt-1">
                  <StatusBadge status={state.status} />
                </div>
                {state.status === "PENDING" && (
                  <p className="mt-1 text-xs text-slate-500">Verifying and extracting marks...</p>
                )}
              </div>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={openFilePicker}
                className="flex-shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
              >
                ↑ Re-upload
              </button>
            )}
          </div>

          {/* Marks table */}
          {!hasMarks ? (
            <p className="text-sm text-slate-500 text-center py-4">No marks extracted yet.</p>
          ) : (
            <>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Extracted Marks{" "}
                    <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      {state.allMarks.length} modules
                    </span>
                  </p>
                  {state.gpa && (
                    <label className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition">
                      <input
                        type="checkbox"
                        checked={!!state.publishGpa}
                        onChange={(e) =>
                          isEditing &&
                          setState((s) => ({ ...s, publishGpa: e.target.checked }))
                        }
                        disabled={!isEditing}
                        className="h-4 w-4 rounded accent-emerald-600 disabled:opacity-50"
                      />
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                        Publish GPA
                      </span>
                      <span className="ml-1 rounded bg-white px-2 py-0.5 text-sm font-bold text-emerald-700 shadow-sm">
                        {state.gpa}
                      </span>
                    </label>
                  )}
                </div>

                {/* ✅ GROUPED DISPLAY */}
                <div className="space-y-4">
                  {grouped.keys.map((semKey) => {
                    const list = grouped.map.get(semKey)!;
                    return (
                      <div key={semKey}>
                        {/* Section header: Year X – Semester Y */}
                        <div className="mb-2 flex items-center justify-between px-1">
                          <p className="text-sm font-semibold text-slate-900">{formatSemesterLabel(semKey)}</p>
                          <span className="text-xs text-slate-500">{list.length} modules</span>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <table className="w-full text-left text-sm">
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 w-16">
                                  Publish
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Module
                                </th>

                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Grade
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Semester
                                </th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                              {list.map((m) => {
                                const checked = publishedKeySet.has(keyOf(m));
                                return (
                                  <tr
                                    key={keyOf(m)}
                                    className={checked ? "bg-blue-50" : "bg-white hover:bg-slate-50"}
                                  >
                                    <td className="px-4 py-3">
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => isEditing && onTogglePublish(m, e.target.checked)}
                                        readOnly={!isEditing}
                                        className={"h-4 w-4 rounded accent-blue-600 " + (isEditing ? "cursor-pointer" : "cursor-default opacity-60")}
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <p className="font-semibold text-slate-900">{m.moduleCode}</p>
                                      <p className="text-xs text-slate-500">{m.moduleName}</p>
                                    </td>

                                    <td className="px-4 py-3">
                                      <GradeBadge grade={m.grade} />
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{m.semester || "—"}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Publish row */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-600">
                  Selected to publish:{" "}
                  <span className="font-bold text-blue-700">{state.publishedMarks.length}</span>{" "}
                  <span className="text-slate-400">/ {state.allMarks.length}</span>
                </p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={onPublishSave}
                    disabled={state.publishedMarks.length === 0}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Published Marks
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400">ℹ️ Only your selected marks are stored — full mark sheet stays private.</p>
            </>
          )}
        </div>
      )}
    </SectionCard>
  );
}