"use client";

import type { StudentProfile } from "@/app/modules/project-group-finder/types";

export default function ProfileHeaderCard({
  profile,
  showMore,
  onToggle,
}: {
  profile: StudentProfile;
  showMore: boolean;
  onToggle: () => void;
}) {
  const initials = profile.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Blue gradient top banner */}
      <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />

      {/* Avatar + info row */}
      <div className="px-6 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar overlapping the banner */}
          <div className="flex items-end gap-4 -mt-8">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-md bg-blue-100 flex items-center justify-center">
              {profile.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={profile.fullName}
                  src={profile.imageUrl}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-blue-600">{initials}</span>
              )}
            </div>

            <div className="min-w-0 pb-1">
              <p className="text-xl font-bold text-slate-900 truncate">{profile.fullName}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                <span className="font-medium text-slate-700">{profile.studentId}</span>
                <span className="mx-1.5 text-slate-300">•</span>
                {profile.email}
              </p>
            </div>
          </div>

          {/* Toggle button */}
          <button
            type="button"
            onClick={onToggle}
            className="flex-shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            {showMore ? "▲ Hide details" : "▼ Show more details"}
          </button>
        </div>
      </div>
    </div>
  );
}