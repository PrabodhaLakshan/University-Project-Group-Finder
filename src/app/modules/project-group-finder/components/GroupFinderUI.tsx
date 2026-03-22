"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import GroupSearchForm, { GroupSearchFilters } from "./GroupSearchForm";
import ProfileCard, { StudentProfile } from "./ProfileCard";
import SearchResults, { SearchResult } from "./SearchResults";
import LeftSidebar, { NavKey } from "./LeftSidebar";
import GroupInvites from "./GroupInvites";
import GroupDashboardPage from "../groups/[id]/page";
import ChatWindow from "./chat/ChatWindow";

type Props = {
  user: { id: string; name: string; email: string; student_id: string };
};

// ── Mock group members ────────────────────────────────────────────────────────
// Later meka DB/API eken ganna puluwan
const GROUP_MEMBERS = [
  { id: "m1", name: "Praboda Lakshan", role: "Leader", gpa: 3.4, avatar: "PL", color: "bg-blue-500" },
  { id: "m2", name: "Nimal Perera", role: "Member", gpa: 3.65, avatar: "NP", color: "bg-green-500" },
  { id: "m3", name: "Imasha Silva", role: "Member", gpa: 3.78, avatar: "IS", color: "bg-indigo-500" },
  { id: "m4", name: "Kasun Fernando", role: "Member", gpa: 3.2, avatar: "KF", color: "bg-orange-500" },
];

// ── Shared UI helpers ─────────────────────────────────────────────────────────
function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${color}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}




// ── DASHBOARD PANEL ───────────────────────────────────────────────────────────
function DashboardPanel({
  myProfile,
}: {
  myProfile: StudentProfile;
}) {
  const [filters, setFilters] = React.useState<GroupSearchFilters>({
    year: "",
    semester: "",
    batch: "",
    specialization: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);

  const handleSearch = async (currentFilters: GroupSearchFilters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        year: currentFilters.year,
        semester: currentFilters.semester,
        batch: currentFilters.batch,
        specialization: currentFilters.specialization,
      });

      const token = localStorage.getItem("pgf_token");
      const res = await fetch(`/api/project-group-finder/search?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data.error || "Search failed");
        setResults([]);
        return;
      }

      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (studentId: string) => {
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

      if (!res.ok) {
        alert(data.error || "Failed to send invite");
        return;
      }

      alert("Invite sent successfully");
    } catch (error) {
      console.error("Invite error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Group Finder"
        subtitle="Search by Year, Semester, Batch, and Specialization."
      />

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Smart matching is enabled ✨</p>
            <p className="mt-1 text-sm text-slate-500">
              Filter students and send invites to build your group faster.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
              Create Group
            </button>
            <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
              View Invites
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Open Chat
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GroupSearchForm
            value={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={() => setResults([])}
            loading={loading}
          />
        </div>

        <ProfileCard profile={myProfile} />
      </div>

      <SearchResults
        results={results}
        loading={loading}
        onRequest={handleInvite}
      />
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function GroupFinderUI({ user }: Props) {
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem("pgf_token");
        const res = await fetch(`/api/project-group-finder/profile?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        }
      } catch (err) {
        console.error("Failed to fetch avatar", err);
      }
    };
    fetchAvatar();
  }, [user.id]);

  const myProfile: StudentProfile = {
    id: user.student_id,
    name: user.name,
    email: user.email,
    imageUrl: avatarUrl,
    specialization: "IT Undergraduate",
    gpa: 3.4,
    availability: "Evening",
    skills: ["Next.js", "React", "Tailwind", "Java", "SQL"],
    year: "3",
    semester: "2",
    batch: "23.2",
    groupStatus: "no_group",
  };

  const [panel, setPanel] = React.useState<NavKey>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [myGroupId, setMyGroupId] = React.useState<string | null>(null);
  const [loadingGroup, setLoadingGroup] = React.useState(true);

  React.useEffect(() => {
    const fetchMyGroup = async () => {
      try {
        const token = localStorage.getItem("pgf_token");
        if (!token) return;

        const res = await fetch("/api/project-group-finder/my-group", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data.groupId) {
          setMyGroupId(data.groupId);
        }
      } catch (err) {
        console.error("Failed to fetch my group", err);
      } finally {
        setLoadingGroup(false);
      }
    };

    fetchMyGroup();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <LeftSidebar
        active={panel}
        onChange={setPanel}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        groupId={myGroupId || ""}
      />

      <div className="lg:pl-[260px]">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 lg:px-8">
          <div className="mb-4 flex lg:hidden">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              ☰ Group Space
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={panel}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {panel === "dashboard" && <DashboardPanel myProfile={myProfile} />}
              {panel === "project-group" && (
                loadingGroup ? (
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  </div>
                ) : myGroupId ? (
                  <GroupDashboardPage groupId={myGroupId} />
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <p className="text-lg font-medium text-slate-900">You are not in a group yet</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Use the search dashboard to invite members and create a group, or wait for someone to invite you.
                    </p>
                    <button
                      onClick={() => setPanel("dashboard")}
                      className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                      Go to Search
                    </button>
                  </div>
                )
              )}
              {panel === "invites" && <GroupInvites />}
              {panel === "chat" && myGroupId ? (
                <ChatWindow groupId={myGroupId} />
              ) : panel === "chat" ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <p className="text-lg font-medium text-slate-900">Group Chat Unavailable</p>
                  <p className="mt-2 text-sm text-slate-500">
                    You need to join or create a group to access the chat.
                  </p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}