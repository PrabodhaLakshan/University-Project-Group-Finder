"use client";

import { useAuth } from "@/app/providers";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import LeftSidebar, { NavKey } from "@/app/modules/project-group-finder/components/LeftSidebar";

type Panel = NavKey;

type StudentProject = {
  id: string;
  title?: string;
  description?: string;
  tech?: string[];
  github_url?: string;
  live_url?: string;
  imageUrl?: string;
  created_at?: string;
};

type StudentData = {
  id: string;
  name: string;
  avatar_url?: string | null;
  specialization?: string | null;
  year?: string | number | null;
  semester?: string | number | null;
  bio?: string | null;
  skills?: string[];
  github_url?: string | null;
  linkedin_url?: string | null;
  mobile_no?: string | null;
  group_status?: string | null;
  group_number?: string | null;
  projects?: StudentProject[];
};

function SkillBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-blue-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  tone?: "blue" | "orange" | "slate";
}) {
  const toneStyles = {
    blue: "border-blue-200/70 bg-blue-50/70 text-blue-900",
    orange: "border-orange-200/70 bg-orange-50/80 text-orange-900",
    slate: "border-slate-200/70 bg-white/85 text-slate-900",
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm backdrop-blur ${toneStyles[tone]}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function InfoCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

export default function StudentProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;

  const [panel, setPanel] = useState<Panel>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [student, setStudent] = useState<StudentData | null>(null);
  const [gpa, setGpa] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchStudent() {
      if (!studentId) return;
      try {
        const res = await fetch(`/api/project-group-finder/profile?userId=${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setStudent(data);
        }

        const resResults = await fetch(`/api/project-group-finder/results?userId=${studentId}`);
        if (resResults.ok) {
          const data = await resResults.json();
          if (data.gpa) setGpa(data.gpa);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchStudent();
  }, [studentId]);

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-3xl border border-blue-100 bg-white px-8 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              <span className="text-sm font-semibold">Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = student?.name
    ? student.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  const handleInvite = async () => {
    setInviting(true);
    try {
      const token = localStorage.getItem("pgf_token");
      const res = await fetch("/api/project-group-finder/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: studentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invite");
      alert("Invite sent successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  const groupStatusLabel =
    student?.group_status === "NO_GROUP"
      ? "Available for a Group"
      : student?.group_status || "Not Specified";

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(37,99,235,0.12), transparent 28%), radial-gradient(circle at top right, rgba(249,115,22,0.14), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #f8fafc 48%, #fffaf5 100%)",
      }}
    >
      <Navbar />

      <LeftSidebar
        active={panel}
        onChange={setPanel}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-[260px]">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-5 flex lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Group Space
            </button>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-x-0.5 hover:text-blue-700"
          >
            <span className="text-base">←</span>
            Back to results
          </motion.button>

          {student ? (
            <div className="space-y-8">
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl"
              >
                <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(120deg,#1d4ed8_0%,#2563eb_35%,#f97316_100%)]" />
                <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl" />

                <div className="relative px-6 pb-8 pt-28 sm:px-8 lg:px-10">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                      <motion.div
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.35 }}
                        className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                      >
                        {student.avatar_url ? (
                          <img
                            src={student.avatar_url}
                            alt={student.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="bg-[linear-gradient(135deg,#2563eb,#f97316)] bg-clip-text text-3xl font-extrabold text-transparent">
                            {initials}
                          </span>
                        )}
                      </motion.div>

                      <div className="max-w-2xl">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-blue-200/80 bg-blue-50/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                            Student Portfolio
                          </span>
                          <span className="rounded-full border border-orange-200/80 bg-orange-50/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">
                            UniNexus
                          </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                          {student.name}
                        </h1>
                        <p className="mt-2 text-base font-medium text-slate-600 sm:text-lg">
                          {student.specialization || "Emerging builder in the UniNexus network"}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {student.year ? <SkillBadge>Year {student.year}</SkillBadge> : null}
                          {student.semester ? <SkillBadge>Semester {student.semester}</SkillBadge> : null}
                          {student.group_number ? <SkillBadge>Batch {student.group_number}</SkillBadge> : null}
                          <SkillBadge>{groupStatusLabel}</SkillBadge>
                        </div>
                      </div>
                    </div>

                    {student.id !== user.id ? (
                      <motion.button
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleInvite}
                        disabled={inviting}
                        className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#f97316)] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(37,99,235,0.24)] transition disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {inviting ? "Sending Invite..." : "Invite to Group"}
                      </motion.button>
                    ) : null}
                  </div>
                </div>
              </motion.section>

              <div className="grid gap-8 xl:grid-cols-[1.55fr_0.95fr]">
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.4 }}
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                  >
                    <StatCard label="GPA" value={gpa ? parseFloat(gpa).toFixed(2) : "-"} tone="blue" />
                    <StatCard label="Group Status" value={student.group_status === "NO_GROUP" ? "No Group" : student.group_status || "-"} tone="orange" />
                    <StatCard label="Batch" value={student.group_number ?? "-"} tone="slate" />
                    <StatCard label="Skills" value={student.skills?.length ?? 0} tone="slate" />
                  </motion.div>

                  {student.bio ? (
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.14, duration: 0.45 }}
                    >
                      <InfoCard
                        title="About"
                        subtitle="A quick look at the student's direction, interests, and working style."
                      >
                        <p className="text-[15px] leading-8 text-slate-600">{student.bio}</p>
                      </InfoCard>
                    </motion.div>
                  ) : null}

                  {student.projects && student.projects.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.45 }}
                    >
                      <InfoCard
                        title="Featured Projects"
                        subtitle="Portfolio-style snapshots of work this student has shared."
                      >
                        <div className="grid gap-5 md:grid-cols-2">
                          {student.projects.map((project, index) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 18 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.24 + index * 0.06, duration: 0.35 }}
                              whileHover={{ y: -6 }}
                              className="group overflow-hidden rounded-[26px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] shadow-sm transition"
                            >
                              <div className="relative h-44 overflow-hidden bg-[linear-gradient(135deg,#dbeafe,#ffedd5)]">
                                {project.imageUrl ? (
                                  <img
                                    src={project.imageUrl}
                                    alt={project.title || "Project image"}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full items-end justify-between bg-[linear-gradient(135deg,#2563eb_0%,#3b82f6_48%,#f97316_100%)] p-5">
                                    <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                                      Project
                                    </span>
                                    <span className="text-5xl font-black text-white/20">
                                      0{index + 1}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                      {project.title || "Untitled Project"}
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">
                                      {project.description || "No description provided."}
                                    </p>
                                  </div>
                                </div>

                                {project.tech && project.tech.length > 0 ? (
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {project.tech.map((tech) => (
                                      <SkillBadge key={tech}>{tech}</SkillBadge>
                                    ))}
                                  </div>
                                ) : null}

                                <div className="mt-5 flex flex-wrap items-center gap-3">
                                  {project.github_url ? (
                                    <a
                                      href={project.github_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                                    >
                                      GitHub
                                    </a>
                                  ) : null}
                                  {project.live_url ? (
                                    <a
                                      href={project.live_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                                    >
                                      Live Demo
                                    </a>
                                  ) : null}
                                  {project.created_at ? (
                                    <span className="ml-auto text-xs font-medium text-slate-400">
                                      Updated {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </InfoCard>
                    </motion.div>
                  ) : null}
                </div>

                <div className="space-y-8">
                  {student.skills && student.skills.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.16, duration: 0.4 }}
                    >
                      <InfoCard
                        title="Skill Stack"
                        subtitle="Capabilities this student is ready to bring into a project team."
                      >
                        <div className="flex flex-wrap gap-2.5">
                          {student.skills.map((skill) => (
                            <motion.div key={skill} whileHover={{ y: -2 }}>
                              <SkillBadge>{skill}</SkillBadge>
                            </motion.div>
                          ))}
                        </div>
                      </InfoCard>
                    </motion.div>
                  ) : null}

                  {(student.mobile_no || student.github_url || student.linkedin_url) ? (
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.22, duration: 0.4 }}
                    >
                      <InfoCard
                        title="Connect"
                        subtitle="Useful ways to reach out or review more of the student's work."
                      >
                        <div className="space-y-3">
                          {student.mobile_no ? (
                            <a
                              href={`tel:${student.mobile_no}`}
                              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
                            >
                              <span>Mobile</span>
                              <span>{student.mobile_no}</span>
                            </a>
                          ) : null}
                          {student.github_url ? (
                            <a
                              href={student.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                              <span>GitHub</span>
                              <span>Open</span>
                            </a>
                          ) : null}
                          {student.linkedin_url ? (
                            <a
                              href={student.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
                            >
                              <span>LinkedIn</span>
                              <span>Open</span>
                            </a>
                          ) : null}
                        </div>
                      </InfoCard>
                    </motion.div>
                  ) : null}

                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.28, duration: 0.42 }}
                  >
                    <div className="overflow-hidden rounded-[28px] border border-blue-200/60 bg-[linear-gradient(145deg,rgba(37,99,235,0.98),rgba(249,115,22,0.95))] p-6 text-white shadow-[0_24px_70px_rgba(37,99,235,0.24)]">
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                        UniNexus Match View
                      </p>
                      <h3 className="mt-3 text-2xl font-black leading-tight">
                        Built to join the right team faster.
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-white/85">
                        Review the skill stack, portfolio work, and academic snapshot to decide whether this student fits your project direction.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-slate-200 bg-white/85 p-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <h2 className="text-2xl font-bold text-slate-900">Student not found</h2>
              <p className="mt-2 text-sm text-slate-500">
                This profile is unavailable or the link is incorrect.
              </p>
              <button
                onClick={() => router.back()}
                className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#2563eb,#f97316)] px-6 py-3 text-sm font-bold text-white shadow-lg"
              >
                Go Back
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
