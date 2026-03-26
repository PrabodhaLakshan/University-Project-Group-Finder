// components/groupFinder/SearchResults.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { StudentProfile } from "./ProfileCard";

export type SearchResult = StudentProfile & {
  matchScore: number; // 0-100
  matchedSkills: string[];
  isInGroup?: boolean;
  hasPendingInvite?: boolean;
};

/** Skill badge — highlighted if it's a matched skill */
function SkillBadge({ text, matched }: { text: string; matched?: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        matched
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-50 text-slate-600",
      ].join(" ")}
    >
      {matched && <span className="mr-1 text-blue-400">✦</span>}
      {text}
    </span>
  );
}

/** Circular match score indicator */
function MatchRing({ score }: { score: number }) {
  const color =
    score >= 75
      ? "text-emerald-600 border-emerald-400 bg-emerald-50"
      : score >= 50
        ? "text-blue-600 border-blue-400 bg-blue-50"
        : score >= 25
          ? "text-amber-600 border-amber-400 bg-amber-50"
          : "text-slate-500 border-slate-300 bg-slate-50";

  return (
    <div
      className={[
        "flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-full border-2 font-bold",
        color,
      ].join(" ")}
    >
      <span className="text-sm leading-none">{score}%</span>
      <span className="text-[9px] font-medium opacity-70 leading-none mt-0.5">match</span>
    </div>
  );
}

/** Availability badge */
function AvailBadge({ label }: { label: string }) {
  const colorMap: Record<string, string> = {
    Morning: "bg-amber-50 text-amber-700 border-amber-200",
    Evening: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Weekend: "bg-green-50 text-green-700 border-green-200",
    Flexible: "bg-teal-50 text-teal-700 border-teal-200",
  };
  const cls = colorMap[label] ?? "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

/** Individual result card */
function ResultCard({
  r,
  onRequest,
}: {
  r: SearchResult;
  onRequest?: (id: string) => void;
}) {
  const router = useRouter();
  const initials = r.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
      {/* Top stripe — colored by match score */}
      <div
        className={[
          "h-1 w-full rounded-t-2xl",
          r.matchScore >= 75
            ? "bg-gradient-to-r from-emerald-400 to-green-500"
            : r.matchScore >= 50
              ? "bg-gradient-to-r from-blue-400 to-indigo-500"
              : r.matchScore >= 25
                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                : "bg-slate-200",
        ].join(" ")}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          {/* Avatar + info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border-2 border-slate-100 bg-blue-50 flex items-center justify-center shadow-sm">
              {r.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={r.name}
                  src={r.imageUrl}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-blue-600">{initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-bold text-slate-900">{r.name}</p>
              <p className="truncate text-xs text-slate-500">{r.specialization}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {r.isInGroup && (
                  <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                    In a Group
                  </span>
                )}
                {!r.isInGroup && (
                  <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                    Looking for Group
                  </span>
                )}
                {r.gpa !== undefined && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    GPA {r.gpa.toFixed(2)}
                  </span>
                )}
                {r.availability && <AvailBadge label={r.availability} />}
                {r.batch && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                    Batch {r.batch}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Match score ring */}
          <MatchRing score={r.matchScore} />
        </div>

        {/* Skills */}
        {r.skills.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Skills{" "}
              {r.matchedSkills.length > 0 && (
                <span className="ml-1 normal-case font-medium text-blue-600">
                  ✦ {r.matchedSkills.length} matched
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {r.skills.slice(0, 10).map((s) => (
                <SkillBadge key={s} text={s} matched={r.matchedSkills.includes(s)} />
              ))}
              {r.skills.length > 10 && (
                <SkillBadge text={`+${r.skills.length - 10} more`} />
              )}
            </div>
          </div>
        )}

        {/* Footer row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">
            {r.matchedSkills.length > 0 ? (
              <>
                Common skills:{" "}
                <span className="font-medium text-blue-600">
                  {r.matchedSkills.slice(0, 3).join(", ")}
                  {r.matchedSkills.length > 3 && ` +${r.matchedSkills.length - 3}`}
                </span>
              </>
            ) : (
              <span className="text-slate-400">No overlapping skills</span>
            )}
          </p>

          <div className="flex items-center gap-2">
            {/* View Profile */}
            <button
              type="button"
              onClick={() => router.push(`/project-group-finder/students/${r.id}`)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 active:scale-95"
            >
              View Profile
            </button>

            {/* Invite */}
            <button
              type="button"
              onClick={() => onRequest?.(r.id)}
              disabled={r.isInGroup || r.hasPendingInvite}
              className={[
                "rounded-xl px-4 py-1.5 text-xs font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95",
                r.isInGroup || r.hasPendingInvite
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
              ].join(" ")}
            >
              {r.isInGroup ? "Already in Group" : r.hasPendingInvite ? "Invite Sent" : "Invite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Loading skeleton */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-3 w-48 rounded bg-slate-100" />
        </div>
        <div className="h-14 w-14 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-6 w-16 rounded-full bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

export default function SearchResults({
  results,
  loading,
  onRequest,
}: {
  results: SearchResult[];
  loading?: boolean;
  onRequest?: (studentId: string) => void;
}) {
  // Don't render the section at all if no search was done
  if (!loading && results.length === 0) return null;

  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Search Results</h3>
          {!loading && results.length > 0 && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {results.length} found
            </span>
          )}
        </div>
        {loading && (
          <span className="text-xs text-slate-500">Searching for matches...</span>
        )}
        {!loading && results.length > 0 && (
          <span className="text-xs text-slate-400">
            Sorted by match score
          </span>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Result cards */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((r) => (
            <ResultCard key={r.id} r={r} onRequest={onRequest} />
          ))}
        </div>
      )}
    </section>
  );
}