"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import GroupSearchForm, { GroupSearchFilters } from "./GroupSearchForm";
import ProfileCard, { StudentProfile } from "./ProfileCard";
import SearchResults, { SearchResult } from "./SearchResults";
import LeftSidebar, { NavKey } from "./LeftSidebar";

type Props = {
  user: { name: string; email: string; student_id: string };
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

// ── PROJECT GROUP PANEL ───────────────────────────────────────────────────────
function ProjectGroupPanel() {
  const incompleteItems = [
    { label: "No project title set", done: false },
    { label: "Repository link missing", done: false },
    { label: "Task assignment pending", done: false },
    { label: "Members confirmed", done: true },
  ];

  const incomplete = incompleteItems.filter((i) => !i.done).length;

  const invites = [
    { id: "i1", name: "Sahan Wickrama", sent: true, time: "2h ago" },
    { id: "i2", name: "Dilini Jayasinghe", sent: true, time: "1d ago" },
    { id: "i3", name: "Ravindu Perera", sent: false, time: "Just now" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Group"
        subtitle="Manage your group members, tasks and invites."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Members"
          value={GROUP_MEMBERS.length}
          color="border-blue-100 bg-blue-50 text-blue-800"
        />
        <StatCard
          label="Incomplete"
          value={incomplete}
          color="border-amber-100 bg-amber-50 text-amber-800"
        />
        <StatCard
          label="Invites sent"
          value={invites.filter((i) => i.sent).length}
          color="border-indigo-100 bg-indigo-50 text-indigo-800"
        />
        <StatCard
          label="Awaiting reply"
          value={invites.filter((i) => !i.sent).length}
          color="border-orange-100 bg-orange-50 text-orange-800"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-slate-900">Your Group Members</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {GROUP_MEMBERS.length} / 4
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {GROUP_MEMBERS.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${m.color}`}
                  >
                    <span className="text-xs font-bold text-white">{m.avatar}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">GPA {m.gpa.toFixed(2)}</p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${m.role === "Leader"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                  >
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50 px-5 py-4">
              <h2 className="text-sm font-bold text-amber-900">Incomplete Items</h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                {incomplete} remaining
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {incompleteItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs ${item.done
                      ? "border-green-400 bg-green-50 text-green-600"
                      : "border-slate-300 bg-white"
                      }`}
                  >
                    {item.done ? "✓" : ""}
                  </span>
                  <p
                    className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700"
                      }`}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-slate-900">Invites</h2>
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                {invites.length} total
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {invites.map((inv) => (
                <div key={inv.id} className="flex items-center gap-3 px-5 py-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                    {inv.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{inv.name}</p>
                    <p className="text-xs text-slate-400">{inv.time}</p>
                  </div>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${inv.sent
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-orange-200 bg-orange-50 text-orange-700"
                      }`}
                  >
                    {inv.sent ? "Sent" : "Pending"}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 px-5 py-3">
              <button className="w-full rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
                + Send New Invite
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── INVITES PANEL ─────────────────────────────────────────────────────────────
function InvitesPanel() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invites" subtitle="Manage invites you sent and received." />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-900">Received (0)</h3>
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">No incoming invites right now.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-900">Sent (3)</h3>
          <div className="space-y-3">
            {["Sahan Wickrama", "Dilini Jayasinghe", "Ravindu Perera"].map((name) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-800">{name}</p>
                <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700">
                  Awaiting
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ── CHAT PANEL ────────────────────────────────────────────────────────────────
function ChatPanel() {
  const [msg, setMsg] = React.useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="Group Chat" subtitle="Real-time chat with your project group." />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm font-semibold text-slate-900">Live</span>
        </div>

        <div className="flex h-64 items-center justify-center bg-slate-50 p-4">
          <p className="text-sm text-slate-400">Chat history will appear here.</p>
        </div>

        <div className="flex gap-2 border-t border-slate-100 p-4">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a message..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Send
          </button>
        </div>
      </section>
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

      const res = await fetch(`/api/project-group-finder/search?${params.toString()}`);
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
      const res = await fetch("/api/project-group-finder/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
  const myProfile: StudentProfile = {
    id: user.student_id,
    name: user.name,
    email: user.email,
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

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <LeftSidebar
        active={panel}
        onChange={setPanel}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
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
              {panel === "project-group" && <ProjectGroupPanel />}
              {panel === "invites" && <InvitesPanel />}
              {panel === "chat" && <ChatPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}