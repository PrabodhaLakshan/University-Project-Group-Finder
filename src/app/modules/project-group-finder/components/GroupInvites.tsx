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
    receiver: {
        id: string;
        name: string;
        email: string;
        specialization: string | null;
        year: number | null;
        semester: number | null;
        avatar_path: string | null;
        avatar_url?: string | null;
        skills: string[];
    } | null;
    type: "sent" | "received";
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

    const handleAction = async (inviteId: string, action: "accept" | "reject" | "cancel") => {
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
            <div className="flex h-64 items-center justify-center rounded-2xl border border-blue-100/50 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                <p className="text-slate-500 font-medium">Loading invites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50/90 backdrop-blur-xl p-6 text-center text-red-600 shadow-sm">
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

    const receivedInvites = invites.filter((i) => i.type === "received");
    const sentInvites = invites.filter((i) => i.type === "sent");

    return (
        <div className="space-y-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Invites</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage invites you sent and received.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                
                {/* Received Invites Section */}
                <section className="rounded-2xl border border-blue-100/50 bg-white/95 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <h3 className="mb-4 text-sm font-bold text-slate-900 border-b border-slate-100/50 pb-3">
                        Received Invites ({receivedInvites.length})
                    </h3>

                    {receivedInvites.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                            <p className="text-sm font-medium text-slate-500">No incoming invites right now.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {receivedInvites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex flex-col gap-4 rounded-xl border border-blue-100/50 bg-blue-50/30 p-5 transition-all shadow-sm hover:shadow-md"
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
                                            <p className="font-medium text-slate-900 leading-snug">
                                                <span className="font-bold text-blue-900">{invite.sender.name}</span> invited you to join
                                                {invite.group ? (
                                                    <span className="font-bold text-blue-900"> {invite.group.name || "their group"}</span>
                                                ) : (
                                                    " a new group"
                                                )}
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                                                <span>Sent {new Date(invite.created_at).toLocaleDateString()}</span>
                                                {invite.sender.specialization && <span>• {invite.sender.specialization}</span>}
                                            </div>

                                            {invite.group && invite.group.members.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="mb-2 text-xs font-semibold text-slate-500">
                                                        Current Members ({invite.group.members.length}/{invite.group.max_members})
                                                    </p>
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

                                    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200/60 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/project-group-finder/students/${invite.sender.id}`)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleAction(invite.id, "reject")}
                                            disabled={actionLoading === invite.id}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleAction(invite.id, "accept")}
                                            disabled={actionLoading === invite.id}
                                            className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-50"
                                        >
                                            {actionLoading === invite.id ? "..." : "Accept"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Sent Invites Section */}
                <section className="rounded-2xl border border-orange-100/50 bg-white/95 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <h3 className="mb-4 text-sm font-bold text-slate-900 border-b border-slate-100/50 pb-3">
                        Sent Invites ({sentInvites.length})
                    </h3>

                    {sentInvites.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                            <p className="text-sm font-medium text-slate-500">You haven't sent any invites.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sentInvites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex flex-col gap-4 rounded-xl border border-orange-100/50 bg-orange-50/30 p-5 transition-all shadow-sm hover:shadow-md"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-sm font-bold text-orange-600 shadow-sm">
                                            {invite.receiver?.avatar_url ? (
                                                <Image
                                                    src={invite.receiver.avatar_url}
                                                    alt={invite.receiver.name}
                                                    className="h-full w-full object-cover"
                                                    width={48}
                                                    height={48}
                                                />
                                            ) : (
                                                invite.receiver?.name.charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-900 leading-snug">
                                                You invited <span className="font-bold text-orange-900">{invite.receiver?.name}</span> to join
                                                {invite.group ? (
                                                    <span className="font-bold text-orange-900"> {invite.group.name || "your group"}</span>
                                                ) : (
                                                    " a new group"
                                                )}
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                                                <span>Sent {new Date(invite.created_at).toLocaleDateString()}</span>
                                                {invite.receiver?.specialization && <span>• {invite.receiver.specialization}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200/60 pt-4">
                                        <span className="inline-flex items-center rounded-full border border-orange-200/60 bg-orange-100/50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-800">
                                            Pending Reply
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/project-group-finder/students/${invite.receiver?.id}`)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAction(invite.id, "cancel")}
                                                disabled={actionLoading === invite.id}
                                                className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-50"
                                            >
                                                {actionLoading === invite.id ? "..." : "Cancel"}
                                            </button>
                                        </div>
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
