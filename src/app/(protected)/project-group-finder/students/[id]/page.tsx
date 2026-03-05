"use client";

import { useAuth } from "@/app/providers";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar, { NavKey } from "@/app/modules/project-group-finder/components/LeftSidebar";
import { useState } from "react";

type Panel = NavKey;

// ── Mock student data (replace with real API call later) ──────────────────────
const MOCK_STUDENTS: Record<string, {
    id: string;
    name: string;
    specialization: string;
    gpa: number;
    availability: string;
    skills: string[];
    bio?: string;
    year?: string;
    semester?: string;
    batch?: string;
    githubUrl?: string;
    linkedinUrl?: string;
}> = {
    s1: {
        id: "s1",
        name: "Nimal Perera",
        specialization: "Software Engineering",
        gpa: 3.65,
        availability: "Weekend",
        skills: ["React", "Node.js", "MongoDB", "Express", "Git"],
        bio: "3rd year IT student passionate about full-stack web development and open source.",
        year: "3",
        semester: "2",
        batch: "23.2",
        githubUrl: "https://github.com/nimal",
    },
    s2: {
        id: "s2",
        name: "Imasha Silva",
        specialization: "Data Science",
        gpa: 3.78,
        availability: "Evening",
        skills: ["Python", "SQL", "PowerBI", "React", "ML"],
        bio: "Focused on machine learning and data visualization. Love building dashboards.",
        year: "3",
        semester: "2",
        batch: "23.2",
        linkedinUrl: "https://linkedin.com/in/imasha",
    },
};

function SkillBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
            {children}
        </span>
    );
}

function StatBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-0.5 text-base font-bold text-slate-800">{value}</p>
        </div>
    );
}

export default function StudentProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const studentId = params?.id as string;

    const [panel, setPanel] = useState<Panel>("dashboard");
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.replace("/login");
    }, [loading, user, router]);

    if (loading)
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-slate-500">Loading...</p>
            </div>
        );
    if (!user) return null;

    const student = MOCK_STUDENTS[studentId];

    const initials = student?.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? "??";

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <LeftSidebar
                active={panel}
                onChange={setPanel}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="lg:pl-[260px]">
                <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">

                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition"
                    >
                        ← Back to results
                    </button>

                    {/* Profile header card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Banner */}
                        <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />

                        <div className="px-6 pb-6">
                            {/* Avatar */}
                            <div className="-mt-8 flex items-end justify-between gap-4">
                                <div className="h-16 w-16 flex-shrink-0 rounded-2xl border-4 border-white bg-blue-100 shadow-md flex items-center justify-center">
                                    <span className="text-xl font-bold text-blue-600">{initials}</span>
                                </div>

                                {student && (
                                    <button
                                        onClick={() => alert(`Invite sent to ${student.name}`)}
                                        className="mb-1 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        Invite
                                    </button>
                                )}
                            </div>

                            {student ? (
                                <>
                                    <div className="mt-3">
                                        <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
                                        <p className="text-sm text-slate-500">{student.specialization}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        <StatBox label="GPA" value={student.gpa.toFixed(2)} />
                                        <StatBox label="Availability" value={student.availability} />
                                        <StatBox label="Batch" value={student.batch ?? "—"} />
                                    </div>

                                    {/* Tags */}
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {student.year && (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                                Year {student.year}
                                            </span>
                                        )}
                                        {student.semester && (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                                Semester {student.semester}
                                            </span>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    {student.bio && (
                                        <div className="mt-5">
                                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Bio</p>
                                            <p className="text-sm text-slate-700 leading-relaxed">{student.bio}</p>
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {student.skills.length > 0 && (
                                        <div className="mt-5">
                                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {student.skills.map((s) => (
                                                    <SkillBadge key={s}>{s}</SkillBadge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links */}
                                    {(student.githubUrl || student.linkedinUrl) && (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {student.githubUrl && (
                                                <a
                                                    href={student.githubUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                                >
                                                    🐙 GitHub →
                                                </a>
                                            )}
                                            {student.linkedinUrl && (
                                                <a
                                                    href={student.linkedinUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                                >
                                                    💼 LinkedIn →
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Student not found */
                                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                                    <p className="text-base font-semibold text-slate-700">Student not found</p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        This profile may not be available or the link is incorrect.
                                    </p>
                                    <button
                                        onClick={() => router.back()}
                                        className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        Go back
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
