"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Invite = {
    id: string;
    status: string;
    created_at: string;
    group_id: string | null;
    sender: {
        id: string;
        name: string;
        email: string;
        specialization: string | null;
        year: number | null;
        semester: number | null;
        avatar_path: string | null;
        avatar_url?: string | null;
        skills: string[];
    };
    group: {
        id: string;
        name: string | null;
        description: string | null;
        max_members: number;
        members: {
            id: string;
            user_id: string;
            role: string;
            user: {
                id: string;
                name: string;
                avatarUrl?: string;
            };
        }[];
    } | null;
};

export default function GroupInvites() {
    const router = useRouter();
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchInvites = async () => {
        try {
            const token = localStorage.getItem("pgf_token");
            if (!token) {
                router.push("/auth/login");
                return;
            }

            const res = await fetch("/api/project-group-finder/invites", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to load invites");
            }

            const data = await res.json();
            setInvites(data.invites);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, [router]);

    const handleAction = async (inviteId: string, action: "accept" | "reject") => {
        setActionLoading(inviteId);
        try {
            const token = localStorage.getItem("pgf_token");
            const res = await fetch(`/api/project-group-finder/invites/${inviteId}/${action}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${action} invite`);
            }

            if (action === "accept") {
                // Navigate to the dashboard, maybe the user wants to stay on the same page,
                // But since group dashboards are deleted, we might just alert them or reload.
                // For now, reload the page or trigger a re-fetch of group status.
                alert("Invite accepted! Group formed.");
                window.location.reload();
            } else {
                setInvites(prev => prev.filter(inv => inv.id !== inviteId));
            }

        } catch (err: any) {
            alert(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <p className="text-slate-500">Loading invites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                <p className="font-semibold">{error}</p>
                <button
                    onClick={fetchInvites}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-medium text-white shadow hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Invites</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage invites you sent and received.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <section className="col-span-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
                    <h3 className="mb-4 text-sm font-bold text-slate-900">Received ({invites.length})</h3>

                    {invites.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                            <p className="text-sm text-slate-500">No incoming invites right now.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-sm font-bold text-blue-600 shadow-sm">
                                            {invite.sender.avatar_url ? (
                                                <Image
                                                    src={invite.sender.avatar_url}
                                                    alt={invite.sender.name}
                                                    className="h-full w-full object-cover"
                                                    width={48}
                                                    height={48}
                                                />
                                            ) : (
                                                invite.sender.name.charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900">
                                                <span className="font-bold">{invite.sender.name}</span> invited you to join
                                                {invite.group ? (
                                                    <span className="font-bold"> {invite.group.name || "their group"}</span>
                                                ) : (
                                                    " a new group"
                                                )}
                                            </p>

                                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                                                <span>Sent {new Date(invite.created_at).toLocaleDateString()}</span>
                                                {invite.sender.specialization && <span>• {invite.sender.specialization}</span>}
                                            </div>

                                            {invite.group && invite.group.members.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="mb-2 text-xs font-semibold text-slate-500">Current Members ({invite.group.members.length}/{invite.group.max_members})</p>
                                                    <div className="flex -space-x-2">
                                                        {invite.group.members.map((member) => (
                                                            <div
                                                                key={member.id}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-600 shadow-sm"
                                                                title={`${member.user.name} (${member.role})`}
                                                            >
                                                                {member.user.avatarUrl ? (
                                                                    <Image
                                                                        src={member.user.avatarUrl}
                                                                        alt={member.user.name}
                                                                        className="h-full w-full rounded-full object-cover"
                                                                        width={32} height={32}
                                                                    />
                                                                ) : (
                                                                    member.user.name.charAt(0)
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3 border-t border-slate-200 pt-4 sm:border-t-0 sm:pt-0">
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/project-group-finder/students/${invite.sender.id}`)}
                                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:flex-none"
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => handleAction(invite.id, "reject")}
                                            disabled={actionLoading === invite.id}
                                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50 sm:flex-none"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleAction(invite.id, "accept")}
                                            disabled={actionLoading === invite.id}
                                            className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 sm:flex-none"
                                        >
                                            {actionLoading === invite.id ? "Accepting..." : "Accept"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
