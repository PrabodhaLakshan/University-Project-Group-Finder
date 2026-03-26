"use client";

import { useAuth } from "@/app/providers";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar, { NavKey } from "@/app/modules/project-group-finder/components/LeftSidebar";

type Panel = NavKey;

function SkillBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
            {children}
        </span>
    );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-0.5 text-base font-bold text-slate-800">{value}</p>
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

    const [student, setStudent] = useState<any>(null);
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
                // Fetch profile
                const res = await fetch(`/api/project-group-finder/profile?userId=${studentId}`);
                if (res.ok) {
                    const data = await res.json();
                    setStudent(data);
                }

                // Fetch GPA
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

    if (authLoading || loadingData)
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-sm text-slate-500">Loading...</p>
            </div>
        );

    if (!user) return null;

    const initials = student?.name
        ? student.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
        : "??";

    const handleInvite = async () => {
        setInviting(true);
        try {
            const res = await fetch("/api/project-group-finder/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: studentId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            alert("Invite sent successfully!");
        } catch (err: any) {
            alert(err.message || "Failed to send invite");
        } finally {
            setInviting(false);
        }
    };

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
                                <div className="h-16 w-16 flex-shrink-0 rounded-2xl border-4 border-white bg-blue-100 shadow-md flex items-center justify-center overflow-hidden">
                                    {student?.avatar_url ? (
                                        <img src={student.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-blue-600">{initials}</span>
                                    )}
                                </div>

                                {student && student.id !== user.id && (
                                    <button
                                        onClick={handleInvite}
                                        disabled={inviting}
                                        className="mb-1 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                                    >
                                        {inviting ? "Sending..." : "Invite"}
                                    </button>
                                )}
                            </div>

                            {student ? (
                                <>
                                    <div className="mt-3">
                                        <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
                                        <p className="text-sm text-slate-500">{student.specialization || "No Specialization Set"}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        <StatBox label="GPA" value={gpa ? parseFloat(gpa).toFixed(2) : "—"} />
                                        <StatBox label="Group Status" value={student.group_status === "NO_GROUP" ? "No Group" : student.group_status || "—"} />
                                        <StatBox label="Group No." value={student.group_number ?? "—"} />
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
                                    {student.skills && student.skills.length > 0 && (
                                        <div className="mt-5">
                                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {student.skills.map((s: string) => (
                                                    <SkillBadge key={s}>{s}</SkillBadge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact & Links */}
                                    {(student.github_url || student.linkedin_url || student.mobile_no) && (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            {student.mobile_no && (
                                                <a
                                                    href={`tel:${student.mobile_no}`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                                >
                                                    📱 {student.mobile_no}
                                                </a>
                                            )}
                                            {student.github_url && (
                                                <a
                                                    href={student.github_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                                >
                                                    🐙 GitHub →
                                                </a>
                                            )}
                                            {student.linkedin_url && (
                                                <a
                                                    href={student.linkedin_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                                                >
                                                    💼 LinkedIn →
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Projects */}
                                    {student.projects && student.projects.length > 0 && (
                                        <div className="mt-8">
                                            <p className="mb-4 text-[13px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">Personal Projects</p>
                                            <div className="space-y-4">
                                                {student.projects.map((p: any) => (
                                                    <div key={p.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden pointer-events-auto">
                                                        {p.imageUrl && (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={p.imageUrl} alt={p.title} className="h-36 w-full object-cover" />
                                                        )}
                                                        <div className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base">📁</span>
                                                                <p className="font-semibold text-slate-900 truncate">{p.title}</p>
                                                            </div>
                                                            {p.description && (
                                                                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.description}</p>
                                                            )}
                                                            {p.tech && p.tech.length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                                    {p.tech.map((t: string) => (
                                                                        <SkillBadge key={t}>{t}</SkillBadge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                                                                {p.github_url && (
                                                                    <a href={p.github_url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:text-blue-700">🐙 Repo →</a>
                                                                )}
                                                                {p.live_url && (
                                                                    <a href={p.live_url} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:text-indigo-700">🔗 Live →</a>
                                                                )}
                                                                {p.created_at && (
                                                                    <span className="ml-auto text-slate-400">Updated {new Date(p.created_at).toLocaleDateString()}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
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
