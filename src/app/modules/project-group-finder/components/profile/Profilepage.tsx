"use client";

import { useMemo, useState, useEffect } from "react";
import type { StudentProfile, Mark } from "@/app/modules/project-group-finder/types";
import { getToken } from "@/lib/auth";

import ProfileHeaderCard from "./ProfileHeaderCard";
import BioSection from "./BioSection";
import MobileSection from "./MobileSection";
import LinksSection from "./LinksSection";
import ProjectsSection from "./ProjectsSection";
import ResultSheetSection from "./ResultSheetSection";

function StatBox({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: number | string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-xl border p-3 transition",
        accent
          ? "border-blue-100 bg-blue-50"
          : "border-slate-100 bg-slate-50",
      ].join(" ")}
    >
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className={["text-lg font-bold", accent ? "text-blue-700" : "text-slate-800"].join(" ")}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    id: "",
    fullName: "",
    studentId: "",
    email: "",
    imageUrl: "",
    bio: "",
    mobile: "",
    githubUrl: "",
    linkedinUrl: "",
    projects: [],
    resultSheet: {
      status: "EMPTY",
      allMarks: [],
      publishedMarks: [],
    },
  });

  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const token = getToken();
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setError("Failed to load your profile. Please log in again.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        const user = data.user;
        setProfile((p) => ({
          ...p,
          id: user.id ?? "",
          fullName: user.name ?? "",
          studentId: user.student_id ?? "",
          email: user.email ?? "",
        }));
      } catch {
        setError("Network error while loading profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const publishedKeySet = useMemo(() => {
    return new Set(profile.resultSheet.publishedMarks.map(markKey));
  }, [profile.resultSheet.publishedMarks]);

  function markKey(m: Mark) {
    return `${m.moduleCode}-${m.marks}-${m.grade}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <svg className="mr-3 h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading your profile…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">

      {/* Page title row */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your portfolio — add bio, projects, links and mark sheet.
        </p>
      </div>

      {/* Header card */}
      <ProfileHeaderCard
        profile={profile}
        showMore={showMore}
        onToggle={() => setShowMore((s) => !s)}
      />

      {/* Collapsed quick view banner */}
      {!showMore ? (
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-blue-900">Portfolio mode</p>
            <p className="mt-0.5 text-sm text-blue-600">
              Click <span className="font-bold">Show more details</span> to add bio, links, projects and marks.
            </p>
          </div>
          <span className="flex-shrink-0 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-600">
            Quick View
          </span>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── LEFT MAIN COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">
            <BioSection
              bio={profile.bio}
              onSave={(bio) => setProfile((p) => ({ ...p, bio }))}
            />

            <ProjectsSection
              projects={profile.projects}
              onAdd={(proj) =>
                setProfile((p) => ({ ...p, projects: [proj, ...p.projects] }))
              }
              onRemove={(id) =>
                setProfile((p) => ({ ...p, projects: p.projects.filter((x) => x.id !== id) }))
              }
            />

            <ResultSheetSection
              state={profile.resultSheet}
              publishedKeySet={publishedKeySet}
              setState={(updater) =>
                setProfile((p) => ({
                  ...p,
                  resultSheet:
                    typeof updater === "function" ? updater(p.resultSheet) : updater,
                }))
              }
              onTogglePublish={(mark, enabled) => {
                setProfile((p) => {
                  const key = markKey(mark);
                  const next = enabled
                    ? [...p.resultSheet.publishedMarks, mark]
                    : p.resultSheet.publishedMarks.filter((m) => markKey(m) !== key);
                  return { ...p, resultSheet: { ...p.resultSheet, publishedMarks: next } };
                });
              }}
              onPublishSave={() => {
                alert("Saved published marks (only selected marks will be stored in DB).");
              }}
            />
          </div>

          {/* ── RIGHT SIDEBAR COLUMN ── */}
          <div className="space-y-5">
            <MobileSection
              mobile={profile.mobile}
              onSave={(mobile) => setProfile((p) => ({ ...p, mobile }))}
            />

            <LinksSection
              githubUrl={profile.githubUrl}
              linkedinUrl={profile.linkedinUrl}
              onSave={(data) => setProfile((p) => ({ ...p, ...data }))}
            />

            {/* Quick Stats card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-bold text-slate-900">Quick Stats</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <StatBox label="Projects" value={profile.projects.length} icon="📁" accent />
                <StatBox label="Published" value={profile.resultSheet.publishedMarks.length} icon="📊" />
                <StatBox
                  label="Modules"
                  value={profile.resultSheet.allMarks.length}
                  icon="📋"
                />
                <StatBox
                  label="Status"
                  value={profile.resultSheet.status === "EMPTY" ? "—" : profile.resultSheet.status}
                  icon={profile.resultSheet.status === "VERIFIED" ? "✅" : "⏳"}
                />
              </div>
            </div>

            {/* Tip card */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">💡 Profile Tip</p>
              <p className="mt-1.5 text-xs text-amber-700 leading-relaxed">
                Keep your profile minimal and strong — only publish marks you are comfortable sharing. A verified mark sheet boosts your smart match score.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}