"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

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

const DASHBOARD_STATE_KEY = "pgf_dashboard_state_v2";

type AdvancedFilters = {
  smartMatch: "all" | "strong" | "medium";
  stack: "all" | "mern" | "next" | "java" | "python" | "mobile";
  language: "all" | "js-ts" | "java" | "python" | "kotlin" | "swift";
  appType: "all" | "web" | "mobile";
};

const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  smartMatch: "all",
  stack: "all",
  language: "all",
  appType: "all",
};

const STACK_KEYWORDS: Record<Exclude<AdvancedFilters["stack"], "all">, string[]> = {
  mern: ["mongo", "mongodb", "express", "react", "node", "mern"],
  next: ["next", "next.js", "react", "typescript"],
  java: ["java", "spring", "spring boot"],
  python: ["python", "django", "flask", "fastapi"],
  mobile: ["flutter", "react native", "android", "kotlin", "swift", "mobile"],
};

const LANGUAGE_KEYWORDS: Record<Exclude<AdvancedFilters["language"], "all">, string[]> = {
  "js-ts": ["javascript", "typescript", "js", "ts"],
  java: ["java"],
  python: ["python"],
  kotlin: ["kotlin"],
  swift: ["swift"],
};

const APP_TYPE_KEYWORDS: Record<Exclude<AdvancedFilters["appType"], "all">, string[]> = {
  web: ["web", "frontend", "backend", "fullstack", "next", "react", "angular", "vue"],
  mobile: ["mobile", "android", "ios", "flutter", "react native", "kotlin", "swift"],
};

function normalizeSkill(value: string) {
  return value.toLowerCase().trim();
}

function hasAnyKeyword(skills: string[], keywords: string[]) {
  const normalizedSkills = skills.map(normalizeSkill);
  return keywords.some((keyword) =>
    normalizedSkills.some((skill) => skill.includes(keyword))
  );
}

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
  const [hasSearched, setHasSearched] = React.useState(false);
  const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFilters>(
    DEFAULT_ADVANCED_FILTERS
  );

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DASHBOARD_STATE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        filters?: GroupSearchFilters;
        results?: SearchResult[];
        hasSearched?: boolean;
        advancedFilters?: AdvancedFilters;
      };

      if (parsed.filters) setFilters(parsed.filters);
      if (Array.isArray(parsed.results)) setResults(parsed.results);
      if (typeof parsed.hasSearched === "boolean") setHasSearched(parsed.hasSearched);
      if (parsed.advancedFilters) setAdvancedFilters(parsed.advancedFilters);
    } catch (error) {
      console.error("Failed to restore dashboard state:", error);
    }
  }, []);

  React.useEffect(() => {
    const state = {
      filters,
      results,
      hasSearched,
      advancedFilters,
    };
    sessionStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify(state));
  }, [filters, results, hasSearched, advancedFilters]);

  const filteredResults = React.useMemo(() => {
    return results.filter((result) => {
      if (result.isInGroup) return false;

      if (advancedFilters.smartMatch === "strong" && result.matchScore < 70) return false;
      if (advancedFilters.smartMatch === "medium" && result.matchScore < 50) return false;

      if (advancedFilters.stack !== "all") {
        const stackKeywords = STACK_KEYWORDS[advancedFilters.stack];
        if (!hasAnyKeyword(result.skills || [], stackKeywords)) return false;
      }

      if (advancedFilters.language !== "all") {
        const languageKeywords = LANGUAGE_KEYWORDS[advancedFilters.language];
        if (!hasAnyKeyword(result.skills || [], languageKeywords)) return false;
      }

      if (advancedFilters.appType !== "all") {
        const appTypeKeywords = APP_TYPE_KEYWORDS[advancedFilters.appType];
        if (!hasAnyKeyword(result.skills || [], appTypeKeywords)) return false;
      }

      return true;
    });
  }, [results, advancedFilters]);

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
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      setHasSearched(true);

      if (!res.ok) {
        console.error(data.error || "Search failed");
        setResults([]);
        return;
      }

      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setHasSearched(true);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setHasSearched(false);
    setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Project Group Finder</h1>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-blue-200/60 bg-white/90 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900">Smart matching is enabled</p>
            <p className="mt-1 text-sm text-blue-700/80">
              Filter students and send invites to build your group faster.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
              Create Group
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              View Invites
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
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
            onReset={() => {
              setResults([]);
              setHasSearched(false);
              setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
            }}
            onClearResults={clearResults}
            loading={loading}
          />
        </div>

        <ProfileCard profile={myProfile} />
      </div>

      {hasSearched && filteredResults.length > 0 && (
        <section className="rounded-2xl border border-blue-100/60 bg-white/95 p-4 shadow-sm backdrop-blur-xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-800">Smart Result Filters</h4>
            <button
              type="button"
              onClick={() => setAdvancedFilters(DEFAULT_ADVANCED_FILTERS)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Smart Matching</span>
              <select
                value={advancedFilters.smartMatch}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    smartMatch: e.target.value as AdvancedFilters["smartMatch"],
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="all">All</option>
                <option value="strong">Strong Match (70%+)</option>
                <option value="medium">Medium Match (50%+)</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">What Is Your Stack</span>
              <select
                value={advancedFilters.stack}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    stack: e.target.value as AdvancedFilters["stack"],
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="all">Any Stack</option>
                <option value="mern">MERN</option>
                <option value="next">Next.js</option>
                <option value="java">Java / Spring</option>
                <option value="python">Python</option>
                <option value="mobile">Flutter / React Native</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Languages</span>
              <select
                value={advancedFilters.language}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    language: e.target.value as AdvancedFilters["language"],
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="all">Any Language</option>
                <option value="js-ts">JavaScript / TypeScript</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="kotlin">Kotlin</option>
                <option value="swift">Swift</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">Mobile App / Web App</span>
              <select
                value={advancedFilters.appType}
                onChange={(e) =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    appType: e.target.value as AdvancedFilters["appType"],
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="all">All</option>
                <option value="web">Web App</option>
                <option value="mobile">Mobile App</option>
              </select>
            </label>
          </div>
        </section>
      )}

      <SearchResults
        results={filteredResults}
        loading={loading}
        hasSearched={hasSearched}
        totalCount={filteredResults.length}
        onRequest={handleInvite}
        onClearResults={clearResults}
      />
    </div>
  );
}

export default function GroupFinderUI({ user }: Props) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get("tab") as NavKey) || "dashboard";

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

  const [panel, setPanel] = React.useState<NavKey>(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [myGroupId, setMyGroupId] = React.useState<string | null>(null);
  const [loadingGroup, setLoadingGroup] = React.useState(true);

  React.useEffect(() => {
    if (["dashboard", "project-group", "invites", "chat"].includes(initialTab)) {
      setPanel(initialTab);
    }
  }, [initialTab]);

  React.useEffect(() => {
    const fetchMyGroup = async () => {
      try {
        const token = localStorage.getItem("pgf_token");
        if (!token) return;

        const res = await fetch("/api/project-group-finder/my-group", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <div
      className="min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(248, 250, 252, 0.7), rgba(248, 250, 252, 0.95)), url('/images/project-group-finder/group-finder-ui-background.png')`,
      }}
    >
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
              Group Space
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
              {panel === "project-group" &&
                (loadingGroup ? (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  </div>
                ) : myGroupId ? (
                  <GroupDashboardPage
                    groupId={myGroupId}
                    onLeaveSuccess={() => {
                      setMyGroupId(null);
                      setPanel("dashboard");
                    }}
                  />
                ) : (
                  <div className="rounded-2xl border border-blue-100/50 bg-white/95 p-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
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
                ))}
              {panel === "invites" && <GroupInvites />}
              {panel === "chat" && myGroupId ? (
                <ChatWindow groupId={myGroupId} />
              ) : panel === "chat" ? (
                <div className="rounded-2xl border border-blue-100/50 bg-white/95 p-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                  <p className="text-lg font-medium text-slate-900">Group Chat Unavailable</p>
                  <p className="mt-2 text-sm text-slate-500">You need to join or create a group to access the chat.</p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
