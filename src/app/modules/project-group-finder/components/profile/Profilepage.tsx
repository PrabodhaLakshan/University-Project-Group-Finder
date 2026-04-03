"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { StudentProfile, Mark } from "@/app/modules/project-group-finder/types";
import { getToken } from "@/lib/auth";

import ProfileHeaderCard from "./ProfileHeaderCard";
import BioSection from "./BioSection";
import MobileSection from "./MobileSection";
import LinksSection from "./LinksSection";
import ProjectsSection from "./ProjectsSection";
import ResultSheetSection from "./ResultSheetSection";
import GroupStatusSection from "./GroupStatusSection";
import SkillsSection from "./SkillsSection";
import AcademicInfoSection, { AcademicInfoData } from "./AcademicInfoSection";
import type { ProfileProject, GroupStatus } from "@/app/modules/project-group-finder/types";

type ProfilePageUser = {
  id: string;
  name: string;
  email: string;
  student_id: string;
};

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
        "flex items-center gap-3 rounded-2xl border p-3 transition shadow-sm",
        accent
          ? "border-blue-200/60 bg-blue-50/80 backdrop-blur-md"
          : "border-slate-200/50 bg-white/80 backdrop-blur-md",
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

export default function ProfilePage({ user }: { user: ProfilePageUser }) {
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
    specialization: undefined,
    year: undefined,
    semester: undefined,
    groupNumber: undefined,
    groupStatus: "NO_GROUP" as GroupStatus,
    skills: [],
    projects: [],
    resultSheet: {
      status: "EMPTY",
      allMarks: [],
      publishedMarks: [],
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Load profile + projects + saved marks from DB on mount ───────────────
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = getToken();
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }
        const userId = user.id;

        // Fetch profile fields, projects and saved marks in parallel.
        const [profileRes, projectsRes, resultsRes] = await Promise.all([
          fetch(`/api/project-group-finder/profile?userId=${userId}`),
          fetch(`/api/project-group-finder/projects?userId=${userId}`),
          fetch(`/api/project-group-finder/results?userId=${userId}`),
        ]);

        const profileData = profileRes.ok ? await profileRes.json() : null;

        // Map DB projects rows → ProfileProject shape
        const dbProjects: ProfileProject[] = projectsRes.ok
          ? (await projectsRes.json()).map((p: any) => ({
            id: p.id,
            name: p.title,
            description: p.description ?? "No description",
            tech: [],                          // DB doesn't store tech separately
            repoUrl: p.github_url ?? undefined,
            liveUrl: p.live_url ?? undefined,
            imageUrl: p.image_path ?? undefined,
            updatedAt: p.created_at
              ? new Date(p.created_at).toLocaleDateString()
              : undefined,
          }))
          : [];

        // Load saved published marks + GPA
        const resultsData = resultsRes.ok ? await resultsRes.json() : { marks: [], gpa: null };
        const savedMarks: Mark[] = resultsData.marks || [];
        const savedGpa: string | null = resultsData.gpa || null;

        setProfile((p) => ({
          ...p,
          id: userId,
          fullName: user.name ?? "",
          studentId: user.student_id ?? "",
          email: user.email ?? "",
          bio: profileData?.bio ?? "",
          mobile: profileData?.mobile_no ?? "",
          githubUrl: profileData?.github_url ?? "",
          linkedinUrl: profileData?.linkedin_url ?? "",
          specialization: profileData?.specialization ?? undefined,
          year: profileData?.year ?? undefined,
          semester: profileData?.semester ?? undefined,
          groupNumber: profileData?.group_number ?? undefined,
          groupStatus: (profileData?.group_status as GroupStatus) ?? "NO_GROUP",
          skills: profileData?.skills ?? [],
          imageUrl: profileData?.avatar_url ?? "",
          projects: dbProjects,
          resultSheet: {
            ...p.resultSheet,
            publishedMarks: savedMarks,
            status: savedMarks.length > 0 ? "VERIFIED" : "EMPTY",
            allMarks: savedMarks.length > 0 ? savedMarks : [],
            // Set GPA and publish state from DB if available
            gpa: savedGpa,
            publishGpa: !!savedGpa,
          },
        }));
      } catch {
        setError("Network error while loading profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  // ── Shared PUT helper ─────────────────────────────────────────────────────
  const saveToDb = useCallback(
    async (fields: {
      bio?: string | null;
      mobile_no?: string | null;
      github_url?: string | null;
      linkedin_url?: string | null;
      group_status?: string | null;
      specialization?: string | null;
      year?: number | null;
      semester?: number | null;
      group_number?: string | null;
      skills?: string[];
    }) => {
      if (!profile.id) return;
      setSaving(true);
      try {
        await fetch(
          `/api/project-group-finder/profile?userId=${profile.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
          }
        );
      } finally {
        setSaving(false);
      }
    },
    [profile.id]
  );

  // ── Section save handlers (update local state + persist to DB) ────────────
  async function saveBio(bio: string) {
    setProfile((p) => ({ ...p, bio }));
    await saveToDb({ bio });
  }

  async function saveMobile(mobile: string) {
    setProfile((p) => ({ ...p, mobile }));
    await saveToDb({ mobile_no: mobile || null });
  }

  async function saveLinks(data: { githubUrl?: string; linkedinUrl?: string }) {
    setProfile((p) => ({ ...p, ...data }));
    await saveToDb({
      github_url: data.githubUrl || null,
      linkedin_url: data.linkedinUrl || null,
    });
  }

  async function saveGroupStatus(status: GroupStatus) {
    setProfile((p) => ({ ...p, groupStatus: status }));
    await saveToDb({ group_status: status });
  }

  async function saveSkills(skills: string[]) {
    setProfile((p) => ({ ...p, skills }));
    await saveToDb({ skills });
  }

  async function saveAcademicInfo(info: AcademicInfoData) {
    setProfile((p) => ({ ...p, ...info }));
    await saveToDb({
      specialization: info.specialization || null,
      year: info.year || null,
      semester: info.semester || null,
      group_number: info.groupNumber || null,
    });
  }

  // ── Add project — POST to API then update state ───────────────────────────
  async function handleAddProject(proj: ProfileProject) {
    if (!profile.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/project-group-finder/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.id,
          title: proj.name,
          description: proj.description,
          github_url: proj.repoUrl ?? null,
          live_url: proj.liveUrl ?? null,
          image_path: proj.imageUrl ?? null,
        }),
      });

      if (!res.ok) {
        alert("Failed to save project. Please try again.");
        return;
      }

      const saved = await res.json();
      // Use the DB-assigned id
      const newProj: ProfileProject = { ...proj, id: saved.id };
      setProfile((p) => ({ ...p, projects: [newProj, ...p.projects] }));
    } finally {
      setSaving(false);
    }
  }

  // ── Remove project — DELETE via API then update state ─────────────────────
  async function handleRemoveProject(id: string) {
    if (!profile.id) return;
    setSaving(true);
    try {
      await fetch(`/api/project-group-finder/projects?projectId=${id}`, {
        method: "DELETE",
      });
      setProfile((p) => ({
        ...p,
        projects: p.projects.filter((x) => x.id !== id),
      }));
    } finally {
      setSaving(false);
    }
  }

  // ── Save published marks to DB ────────────────────────────────────────────
  async function handlePublishSave() {
    if (!profile.id) return;
    setSaving(true);
    try {
      const res = await fetch("/api/project-group-finder/results/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.id,
          marks: profile.resultSheet.publishedMarks,
          gpa: profile.resultSheet.publishGpa ? profile.resultSheet.gpa : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Saved ${data.saved} published marks to your profile.`);
      } else {
        alert("Failed to save marks. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
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
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your portfolio — add bio, projects, links and mark sheet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Saving indicator */}
          {saving && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </span>
          )}

          {/* Global Edit / Done toggle */}
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className={[
              "flex-shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1",
              isEditing
                ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
            ].join(" ")}
          >
            {isEditing ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Done
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.414-6.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                </svg>
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header card */}
      <ProfileHeaderCard
        profile={profile}
        showMore={isEditing}
        onToggle={() => setIsEditing((v) => !v)}
        onImageChange={(newUrl) => setProfile((p) => ({ ...p, imageUrl: newUrl }))}
      />

      {/* Main layout — always visible */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* ── LEFT MAIN COLUMN ── */}
        <div className="lg:col-span-2 space-y-6">
          <BioSection
            bio={profile.bio}
            isEditing={isEditing}
            onSave={saveBio}
          />

          <ProjectsSection
            projects={profile.projects}
            userId={profile.id}
            isEditing={isEditing}
            onAdd={handleAddProject}
            onRemove={handleRemoveProject}
          />

          <ResultSheetSection
            state={profile.resultSheet}
            publishedKeySet={publishedKeySet}
            isEditing={isEditing}
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
            onPublishSave={handlePublishSave}
          />
        </div>

        {/* ── RIGHT SIDEBAR COLUMN ── */}
        <div className="space-y-5">
          <MobileSection
            mobile={profile.mobile}
            isEditing={isEditing}
            onSave={saveMobile}
          />

          <GroupStatusSection
            status={profile.groupStatus}
            isEditing={isEditing}
            onSave={saveGroupStatus}
          />

          <SkillsSection
            skills={profile.skills}
            isEditing={isEditing}
            onSave={saveSkills}
          />

          <AcademicInfoSection
            data={{
              specialization: profile.specialization,
              year: profile.year,
              semester: profile.semester,
              groupNumber: profile.groupNumber,
            }}
            isEditing={isEditing}
            onSave={saveAcademicInfo}
          />

          <LinksSection
            githubUrl={profile.githubUrl}
            linkedinUrl={profile.linkedinUrl}
            isEditing={isEditing}
            onSave={saveLinks}
          />

          {/* Quick Stats card */}
          <div className="rounded-2xl border border-blue-100/50 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="border-b border-slate-100/50 px-5 py-4">
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

          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/90 backdrop-blur-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <p className="text-sm font-semibold text-amber-800">💡 Profile Tip</p>
            <p className="mt-1.5 text-xs text-amber-700 leading-relaxed">
              Keep your profile minimal and strong — only publish marks you are comfortable sharing. A verified mark sheet boosts your smart match score.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
