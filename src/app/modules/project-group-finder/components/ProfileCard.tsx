"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export type StudentProfile = {
  id: string;
  name: string;
  email?: string;
  imageUrl?: string;
  specialization: string;
  gpa?: number;
  year?: string;
  semester?: string;
  batch?: string;
  availability?: string;
  skills: string[];
  groupStatus?: "pending" | "no_group" | "in_group";
};

function getSkillTone(skill: string) {
  const key = skill.trim().toLowerCase();
  if (key.includes("react")) return "bg-violet-100 text-violet-700 border-violet-200";
  if (key.includes("next")) return "bg-sky-100 text-sky-700 border-sky-200";
  if (key.includes("tailwind")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (key.includes("java")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function SkillBadge({ children }: { children: React.ReactNode }) {
  const tone = typeof children === "string" ? getSkillTone(children) : "bg-slate-100 text-slate-700 border-slate-200";

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}>{children}</span>;
}

function StatBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={["rounded-xl border p-3 text-center", accent ? "border-blue-100 bg-blue-50" : "border-slate-100 bg-slate-50"].join(" ")}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={["mt-0.5 text-base font-bold", accent ? "text-blue-700" : "text-slate-800"].join(" ")}>{value}</p>
    </div>
  );
}

export default function ProfileCard({
  profile,
}: {
  profile: StudentProfile;
}) {
  const router = useRouter();

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="sticky top-6 overflow-hidden rounded-2xl border border-blue-100/50 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-40 bg-gradient-to-b from-sky-400/20 to-transparent" />

      <div className="relative z-10 px-5 pb-2 pt-6">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-sm">
          {profile.imageUrl ? (
            <img alt={profile.name} src={profile.imageUrl} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-blue-600">{initials}</span>
          )}
        </div>
      </div>

      <div className="relative z-10 px-5 pb-5 pt-1">
        <p className="text-base font-bold text-slate-900">{profile.name}</p>
        <p className="text-sm text-slate-500">{profile.specialization}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatBox label="GPA" value={profile.gpa?.toFixed(2) ?? "-"} accent />
          <StatBox label="Availability" value={profile.availability ?? "-"} />
        </div>

        {(profile.year || profile.semester || profile.batch) && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.year && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">Y{profile.year}</span>}
            {profile.semester && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">S{profile.semester}</span>}
            {profile.batch && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{profile.batch}</span>}
          </div>
        )}

        {profile.skills.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 8).map((s) => (
                <SkillBadge key={s}>{s}</SkillBadge>
              ))}
              {profile.skills.length > 8 && <SkillBadge>+{profile.skills.length - 8}</SkillBadge>}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/project-group-finder/profile")}
          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          View Full Profile
        </button>
      </div>
    </aside>
  );
}
