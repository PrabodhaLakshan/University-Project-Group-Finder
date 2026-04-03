"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileImage, FileText, Film, Link2, Trash2, Upload } from "lucide-react";

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

type ResourceKind = "document" | "image" | "video";

type ProjectResource = {
    name: string;
    path: string;
    kind: ResourceKind;
    size: number | null;
    createdAt: string | null;
    updatedAt: string | null;
    uploaderId: string;
    url: string | null;
    canDelete: boolean;
};

const RESOURCE_OPTIONS: Array<{
    kind: ResourceKind;
    label: string;
    accept: string;
    description: string;
}> = [
    {
        kind: "document",
        label: "Document",
        accept: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,.rar",
        description: "PDFs, docs, slides, sheets, archives",
    },
    {
        kind: "image",
        label: "Image",
        accept: "image/*",
        description: "JPG, PNG, WEBP, GIF",
    },
    {
        kind: "video",
        label: "Video",
        accept: "video/mp4,video/webm,video/quicktime,video/x-matroska",
        description: "MP4, WEBM, MOV, MKV",
    },
];

function formatBytes(bytes: number | null) {
    if (!bytes) return "Unknown size";

    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function getResourceIcon(kind: ResourceKind) {
    if (kind === "image") return FileImage;
    if (kind === "video") return Film;
    return FileText;
}

type GroupDashboardPageProps = {
    groupId: string;
    onLeaveSuccess?: () => void;
};

export default function GroupDashboardPage({ groupId, onLeaveSuccess }: GroupDashboardPageProps) {
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
    const [leaving, setLeaving] = useState(false);

    // Profile Modal State
    const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);

    // Role changing state
    const [changingRole, setChangingRole] = useState<string | null>(null);
    const [removingMember, setRemovingMember] = useState<string | null>(null);
    const [resources, setResources] = useState<ProjectResource[]>([]);
    const [resourceError, setResourceError] = useState<string | null>(null);
    const [resourceLoading, setResourceLoading] = useState(true);
    const [uploadingKind, setUploadingKind] = useState<ResourceKind | null>(null);
    const [deletingResourcePath, setDeletingResourcePath] = useState<string | null>(null);

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

    const fetchResources = async () => {
        try {
            setResourceError(null);
            const token = localStorage.getItem("pgf_token");
            if (!token) {
                router.push("/auth/login");
                return;
            }

            const res = await fetch(`/api/project-group-finder/groups/${groupId}/resources`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to load resources");
            }

            setResources(data.resources || []);
        } catch (err: any) {
            setResourceError(err.message || "Failed to load resources");
        } finally {
            setResourceLoading(false);
        }
    };

    useEffect(() => {
        fetchGroup();
        fetchResources();
    }, [groupId, router]);

    const handleResourceUpload = async (kind: ResourceKind, file: File | null) => {
        if (!file) return;

        setUploadingKind(kind);
        setResourceError(null);

        try {
            const token = localStorage.getItem("pgf_token");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("kind", kind);

            const res = await fetch(`/api/project-group-finder/groups/${groupId}/resources`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to upload resource");
            }

            setResources((prev) => [data.resource, ...prev]);
        } catch (err: any) {
            setResourceError(err.message || "Failed to upload resource");
        } finally {
            setUploadingKind(null);
        }
    };

    const handleDeleteResource = async (resource: ProjectResource) => {
        const confirmed = window.confirm(`Delete ${resource.name}?`);
        if (!confirmed) return;

        setDeletingResourcePath(resource.path);
        setResourceError(null);

        try {
            const token = localStorage.getItem("pgf_token");
            const res = await fetch(`/api/project-group-finder/groups/${groupId}/resources`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ path: resource.path }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to delete resource");
            }

            setResources((prev) => prev.filter((item) => item.path !== resource.path));
        } catch (err: any) {
            setResourceError(err.message || "Failed to delete resource");
        } finally {
            setDeletingResourcePath(null);
        }
    };

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

    const handleChangeRole = async (memberUserId: string, newRole: string) => {
        setChangingRole(memberUserId);
        try {
            const token = localStorage.getItem("pgf_token");
            const res = await fetch(`/api/project-group-finder/groups/${groupId}/members/${memberUserId}/role`, {
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
                    members: prev.members.map((m) =>
                        m.user_id === memberUserId ? { ...m, role: newRole } : m
                    )
                };
            });
        } catch (err: any) {
            alert(err.message || "Failed to update role");
        } finally {
            setChangingRole(null);
        }
    };

    const handleRemoveMember = async (member: Member) => {
        const confirmed = window.confirm(`Remove ${member.user.name} from this group?`);
        if (!confirmed) return;

        setRemovingMember(member.user_id);
        try {
            const token = localStorage.getItem("pgf_token");
            const res = await fetch(`/api/project-group-finder/groups/${groupId}/members/${member.user_id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to remove member");

            alert(data.message || "Member removed successfully");
            setGroup((prev) => {
                if (!prev) return prev;

                const nextMembers = prev.members.filter((m) => m.user_id !== member.user_id);
                return {
                    ...prev,
                    members: nextMembers,
                    status: data.status || prev.status,
                };
            });
        } catch (err: any) {
            alert(err.message || "Failed to remove member");
        } finally {
            setRemovingMember(null);
        }
    };

    const handleLeaveGroup = async () => {
        if (!group || !currentUserId) return;

        const confirmed = window.confirm("Are you sure you want to leave this group?");
        if (!confirmed) return;

        setLeaving(true);
        try {
            const token = localStorage.getItem("pgf_token");
            const res = await fetch(`/api/project-group-finder/groups/${groupId}/leave`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            alert(data.message || "You left the group successfully.");
            onLeaveSuccess?.();
            router.push("/project-group-finder");
            router.refresh();
        } catch (err: any) {
            alert(err.message || "Failed to leave group");
        } finally {
            setLeaving(false);
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

    const isCurrentUserMember = group.members.some((member) => member.user_id === currentUserId);
    const currentUserRole = group.members.find(m => m.user_id === currentUserId)?.role;
    const isLeader = currentUserRole === "leader";

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Group Info & Form */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-blue-100/50 bg-white/95 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-8">
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

                                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Project Resources</h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Group-specific documents, images, and videos for this project.
                                            </p>
                                        </div>
                                        <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                                            {resources.length} files
                                        </span>
                                    </div>

                                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                                        {RESOURCE_OPTIONS.map((option) => (
                                            <label
                                                key={option.kind}
                                                className="cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50/40"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                                                        <Upload className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            Add {option.label}
                                                        </p>
                                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                                            {uploadingKind === option.kind
                                                                ? "Uploading..."
                                                                : option.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept={option.accept}
                                                    className="hidden"
                                                    disabled={uploadingKind !== null}
                                                    onChange={(event) => {
                                                        const selectedFile = event.target.files?.[0] || null;
                                                        void handleResourceUpload(option.kind, selectedFile);
                                                        event.target.value = "";
                                                    }}
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    {resourceError && (
                                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                            {resourceError}
                                        </div>
                                    )}

                                    <div className="mt-5 space-y-3">
                                        {resourceLoading ? (
                                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
                                                Loading project resources...
                                            </div>
                                        ) : resources.length === 0 ? (
                                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
                                                No resources yet. Upload the first file for this group.
                                            </div>
                                        ) : (
                                            resources.map((resource) => {
                                                const Icon = getResourceIcon(resource.kind);

                                                return (
                                                    <div
                                                        key={resource.path}
                                                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                                                    >
                                                        <div className="flex min-w-0 items-start gap-3">
                                                            <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                                                                <Icon className="h-5 w-5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                                    {resource.name}
                                                                </p>
                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {resource.kind.charAt(0).toUpperCase() + resource.kind.slice(1)} • {formatBytes(resource.size)}
                                                                    {resource.createdAt
                                                                        ? ` • ${new Date(resource.createdAt).toLocaleDateString()}`
                                                                        : ""}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {resource.url && (
                                                                <a
                                                                    href={resource.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                                                >
                                                                    <Link2 className="h-4 w-4" />
                                                                    Open
                                                                </a>
                                                            )}
                                                            {resource.canDelete && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteResource(resource)}
                                                                    disabled={deletingResourcePath === resource.path}
                                                                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                    {deletingResourcePath === resource.path ? "Deleting..." : "Delete"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Members List & Settings */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Members List */}
                    <div className="rounded-2xl border border-blue-100/50 bg-white/95 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
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
                    <div className="rounded-2xl border border-blue-100/50 bg-white/95 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
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
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            disabled={changingRole === member.user_id || removingMember === member.user_id}
                                                            value={member.role}
                                                            onChange={(e) => handleChangeRole(member.user_id, e.target.value)}
                                                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="member">Member</option>
                                                            <option value="leader">Leader</option>
                                                        </select>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMember(member)}
                                                            disabled={changingRole === member.user_id || removingMember === member.user_id}
                                                            className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {removingMember === member.user_id ? "Removing..." : "Remove"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-lg">You ({member.role})</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {isCurrentUserMember && (
                                    <div className="border-t border-slate-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleLeaveGroup}
                                            disabled={leaving}
                                            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {leaving ? "Leaving..." : "Leave Group"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500">Only the group leader can access settings.</p>

                                {isCurrentUserMember && (
                                    <div className="border-t border-slate-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleLeaveGroup}
                                            disabled={leaving}
                                            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {leaving ? "Leaving..." : "Leave Group"}
                                        </button>
                                    </div>
                                )}
                            </div>
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
