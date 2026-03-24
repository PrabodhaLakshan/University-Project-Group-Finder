"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import ProfileCard, { StudentProfile } from "../../components/ProfileCard";

type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    specialization: string | null;
    student_id: string;
    year: string | null;
    semester: string | null;
    skills: string[];
    bio: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    mobile_no: string | null;
};

type Member = {
    id: string;
    user_id: string;
    role: string;
    joined_at: string;
    user: User;
};

type Group = {
    id: string;
    name: string | null;
    description: string | null;
    status: string;
    max_members: number;
    created_at: string;
    members: Member[];
};

export default function GroupDashboardPage({ groupId }: { groupId: string }) {
    const router = useRouter();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Editing States
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editMaxMembers, setEditMaxMembers] = useState<number>(4);
    const [saving, setSaving] = useState(false);

    // Profile Modal State
    const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);

    // Role changing state
    const [changingRole, setChangingRole] = useState<string | null>(null);

    const currentUserToken = typeof window !== "undefined" ? localStorage.getItem("pgf_token") : null;
    let currentUserId: string | null = null;
    if (currentUserToken) {
        try {
            const payload = JSON.parse(atob(currentUserToken.split(".")[1]));
            currentUserId = payload.userId || payload.id;
        } catch (e) { }
    }

    const fetchGroup = async () => {
        try {
            const token = localStorage.getItem("pgf_token");
            if (!token) {
                router.push("/auth/login");
                return;
            }

            const res = await fetch(`/api/project-group-finder/groups/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                if (res.status === 404) throw new Error("Group not found");
                throw new Error("Failed to load group details");
            }

            const data = await res.json();
            setGroup(data.group);
            setEditName(data.group.name || "");
            setEditDescription(data.group.description || "");
            setEditMaxMembers(data.group.max_members || 4);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [groupId, router]);

    const handleUpdateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("pgf_token");
            const res = await fetch(`/api/project-group-finder/groups/${groupId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editName,
                    description: editDescription,
                    max_members: editMaxMembers,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            alert("Group updated successfully!");
            setGroup({ ...group!, ...data.group });
            setIsEditing(false);
        } catch (err: any) {
            alert(err.message || "Failed to update group");
        } finally {
            setSaving(false);
        }
    };

    const handleChangeRole = async (memberId: string, newRole: string) => {
        setChangingRole(memberId);
        try {
            const token = localStorage.getItem("pgf_token");
            const res = await fetch(`/api/project-group-finder/groups/${groupId}/members/${memberId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            alert("Role updated successfully!");
            setGroup(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    members: prev.members.map(m => m.id === memberId ? { ...m, role: newRole } : m)
                };
            });
        } catch (err: any) {
            alert(err.message || "Failed to update role");
        } finally {
            setChangingRole(null);
        }
    };

    const openProfile = (member: Member) => {
        setSelectedProfile({
            id: member.user.student_id,
            name: member.user.name,
            email: member.user.email,
            imageUrl: member.user.avatarUrl,
            specialization: member.user.specialization || "Unspecified",
            year: member.user.year || undefined,
            semester: member.user.semester || undefined,
            skills: member.user.skills || [],
            groupStatus: "in_group"
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    if (error || !group) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                    <p className="text-xl font-semibold">{error || "Group not found"}</p>
                    <button
                        onClick={() => router.push("/project-group-finder/search")}
                        className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Return to Search
                    </button>
                </div>
            </div>
        );
    }

    const currentUserRole = group.members.find(m => m.user_id === currentUserId)?.role;
    const isLeader = currentUserRole === "leader";

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Group Info & Form */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        {isEditing && isLeader ? (
                            <form onSubmit={handleUpdateGroup} className="space-y-5">
                                <h2 className="text-xl font-bold text-slate-900">Edit Group Settings</h2>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Group Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        maxLength={30}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="e.g. Nexus Team"
                                    />
                                    <p className="mt-1 text-right text-xs text-slate-500">
                                    {editName.length}/30
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Description / Topic</label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        rows={4}
                                         maxLength={150}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="What is your group working on?"
                                    />
                                 <p className="mt-1 text-right text-xs text-slate-500">
                                    {editDescription.length}/150
                                    </p>  
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Max Member Limit</label>
                                    <select
                                        value={editMaxMembers}
                                        onChange={(e) => setEditMaxMembers(Number(e.target.value))}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value={2}>2 Members</option>
                                        <option value={3}>3 Members</option>
                                        <option value={4}>4 Members</option>
                                        <option value={5}>5 Members</option>
                                    </select>
                                    <p className="mt-1 text-xs text-slate-500">If you reduce this below current members, you will be marked as FULL.</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                                            {group.name || `Group #${group.id}`}
                                        </h1>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${group.status === "full" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                                }`}>
                                                {group.status === "full" ? "Looking for Nobody (FULL)" : "Actively Recruiting"}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                Created {new Date(group.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {isLeader && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                        >
                                            Edit Settings
                                        </button>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-slate-900">About the Group</h3>
                                    <p className="mt-2 whitespace-pre-wrap text-slate-600">
                                        {group.description || "No description provided."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Members List & Settings */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Members List */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Members</h3>
                            <span className="text-sm font-medium text-slate-500">
                                {group.members.length} / {group.max_members}
                            </span>
                        </div>

                        <ul className="space-y-4">
                            {group.members.map((member) => (
                                <li key={member.id} className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 shrink-0 cursor-pointer rounded-full border border-slate-200 bg-slate-100 overflow-hidden" onClick={() => openProfile(member)}>
                                        {member.user.avatarUrl ? (
                                            <Image
                                                src={member.user.avatarUrl}
                                                alt={member.user.name}
                                                className="h-full w-full object-cover"
                                                width={40} height={40}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center font-bold text-slate-400">
                                                {member.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openProfile(member)}>
                                        <p className="truncate text-sm font-semibold text-slate-900 hover:text-blue-600 transition">
                                            {member.user.name}
                                            {member.user_id === currentUserId && <span className="ml-1 text-slate-400 font-normal">(You)</span>}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {member.user.specialization || member.user.student_id}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right flex items-center gap-2">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${member.role === "leader" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {member.role}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {group.members.length < group.max_members && (
                            <button
                                onClick={() => router.push("/project-group-finder/search")}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                            >
                                + Find Members
                            </button>
                        )}
                    </div>

                    {/* Group Setting */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Group Setting</h3>
                        </div>
                        {isLeader ? (
                            <div className="space-y-6">
                                {/* Max Members */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-800">Max Member Limit</label>
                                    <p className="text-xs text-slate-500 mb-2">Change the maximum number of people allowed in the group.</p>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={editMaxMembers}
                                            onChange={(e) => setEditMaxMembers(Number(e.target.value))}
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value={2}>2 Members</option>
                                            <option value={3}>3 Members</option>
                                            <option value={4}>4 Members</option>
                                            <option value={5}>5 Members</option>
                                        </select>
                                        <button
                                            onClick={handleUpdateGroup}
                                            disabled={saving}
                                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                        >
                                            {saving ? "..." : "Save"}
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <label className="text-sm font-semibold text-slate-800 mb-3 block">Manage Roles</label>
                                    <ul className="space-y-3">
                                        {group.members.map((member) => (
                                            <li key={member.id} className="flex items-center justify-between">
                                                <span className="text-sm text-slate-700 truncate mr-2">{member.user.name}</span>
                                                {member.user_id !== currentUserId ? (
                                                    <select
                                                        disabled={changingRole === member.id}
                                                        value={member.role}
                                                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                                                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="leader">Leader</option>
                                                    </select>
                                                ) : (
                                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-lg">You ({member.role})</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Only the group leader can access settings.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {selectedProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-sm">
                        <ProfileCard profile={selectedProfile} />
                        <button
                            onClick={() => setSelectedProfile(null)}
                            className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-md hover:text-slate-900"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
