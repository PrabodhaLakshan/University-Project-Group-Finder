"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Oxanium } from "next/font/google";
import Navbar from "@/components/Navbar";
import {
  getConversation,
  getConversations,
  markAsRead,
  sendMessage,
} from "@/app/modules/uni-mart/services/message.service";
import type { Conversation, Message } from "@/app/modules/uni-mart/types";
import { getToken } from "@/lib/auth";
import {
  Store,
  UsersRound,
  GraduationCap,
  BriefcaseBusiness,
  Search,
  SendHorizontal,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

type ChatModuleKey = "marketplace" | "group-finder" | "tutor-connect" | "startup-connect";
type ConversationFilter = "all" | "buyer" | "seller";
type ModuleTheme = {
  title: string;
  searchPlaceholder: string;
  sidebarRailBg: string;
  sidebarGlowTop: string;
  sidebarGlowBottom: string;
  sidebarActiveTile: string;
  sidebarActiveIconText: string;
  filterActiveBg: string;
  filterActiveHoverBg: string;
  filterActiveShadow: string;
  accentText: string;
  accentSoftBg: string;
  accentSoftBorder: string;
  accentDotBg: string;
  selectedCardBorder: string;
  selectedCardShadow: string;
  unreadBadgeBg: string;
  sendButtonBg: string;
  sendButtonHoverBg: string;
  rightPanelBg: string;
  rightHeaderBg: string;
  rightComposerFocusBorder: string;
  rightComposerFocusRing: string;
  incomingBubbleBg: string;
  incomingBubbleBorder: string;
};

const chatModules: Array<{
  key: ChatModuleKey;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  enabled: boolean;
}> = [
  { key: "marketplace", label: "Marketplace", icon: Store, enabled: true },
  { key: "group-finder", label: "Group Finder", icon: UsersRound, enabled: false },
  { key: "tutor-connect", label: "Tutor Connect", icon: GraduationCap, enabled: false },
  { key: "startup-connect", label: "Startup Connect", icon: BriefcaseBusiness, enabled: false },
];

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const moduleThemes: Record<ChatModuleKey, ModuleTheme> = {
  marketplace: {
    title: "Marketplace Messages",
    searchPlaceholder: "Search Marketplace Messages",
    sidebarRailBg: "bg-gradient-to-b from-[#3f1d00] via-[#8a3d00] to-[#cc5b00]",
    sidebarGlowTop: "bg-orange-300/35",
    sidebarGlowBottom: "bg-amber-200/30",
    sidebarActiveTile: "border-orange-100/60 bg-white shadow-xl shadow-orange-900/30",
    sidebarActiveIconText: "text-orange-600",
    filterActiveBg: "bg-orange-500",
    filterActiveHoverBg: "hover:bg-orange-600",
    filterActiveShadow: "shadow-orange-200/60",
    accentText: "text-orange-500",
    accentSoftBg: "bg-orange-50",
    accentSoftBorder: "border-orange-200",
    accentDotBg: "bg-orange-500",
    selectedCardBorder: "border-orange-300",
    selectedCardShadow: "shadow-[0_14px_30px_rgba(249,115,22,0.2)]",
    unreadBadgeBg: "bg-orange-500",
    sendButtonBg: "bg-orange-500",
    sendButtonHoverBg: "hover:bg-orange-600",
    rightPanelBg: "bg-gradient-to-b from-orange-50/35 to-white/70",
    rightHeaderBg: "bg-orange-50/70",
    rightComposerFocusBorder: "focus:border-orange-300",
    rightComposerFocusRing: "focus:ring-orange-100",
    incomingBubbleBg: "bg-orange-50/85",
    incomingBubbleBorder: "border-orange-100",
  },
  "group-finder": {
    title: "Group Finder Messages",
    searchPlaceholder: "Search Group Finder Messages",
    sidebarRailBg: "bg-gradient-to-b from-[#3f2a00] via-[#7a5300] to-[#c28500]",
    sidebarGlowTop: "bg-amber-300/35",
    sidebarGlowBottom: "bg-yellow-200/25",
    sidebarActiveTile: "border-amber-100/60 bg-white shadow-xl shadow-amber-900/30",
    sidebarActiveIconText: "text-amber-600",
    filterActiveBg: "bg-amber-500",
    filterActiveHoverBg: "hover:bg-amber-600",
    filterActiveShadow: "shadow-amber-200/60",
    accentText: "text-amber-500",
    accentSoftBg: "bg-amber-50",
    accentSoftBorder: "border-amber-200",
    accentDotBg: "bg-amber-500",
    selectedCardBorder: "border-amber-300",
    selectedCardShadow: "shadow-[0_14px_30px_rgba(245,158,11,0.2)]",
    unreadBadgeBg: "bg-amber-500",
    sendButtonBg: "bg-amber-500",
    sendButtonHoverBg: "hover:bg-amber-600",
    rightPanelBg: "bg-gradient-to-b from-amber-50/30 to-white/70",
    rightHeaderBg: "bg-amber-50/70",
    rightComposerFocusBorder: "focus:border-amber-300",
    rightComposerFocusRing: "focus:ring-amber-100",
    incomingBubbleBg: "bg-amber-50/85",
    incomingBubbleBorder: "border-amber-100",
  },
  "startup-connect": {
    title: "Startup Connect Messages",
    searchPlaceholder: "Search Startup Connect Messages",
    sidebarRailBg: "bg-gradient-to-b from-[#06113a] via-[#12348a] to-[#1d4ed8]",
    sidebarGlowTop: "bg-blue-300/35",
    sidebarGlowBottom: "bg-indigo-200/30",
    sidebarActiveTile: "border-blue-100/60 bg-white shadow-xl shadow-blue-900/30",
    sidebarActiveIconText: "text-blue-600",
    filterActiveBg: "bg-blue-600",
    filterActiveHoverBg: "hover:bg-blue-700",
    filterActiveShadow: "shadow-blue-200/60",
    accentText: "text-blue-600",
    accentSoftBg: "bg-blue-50",
    accentSoftBorder: "border-blue-200",
    accentDotBg: "bg-blue-600",
    selectedCardBorder: "border-blue-300",
    selectedCardShadow: "shadow-[0_14px_30px_rgba(37,99,235,0.2)]",
    unreadBadgeBg: "bg-blue-600",
    sendButtonBg: "bg-blue-600",
    sendButtonHoverBg: "hover:bg-blue-700",
    rightPanelBg: "bg-gradient-to-b from-blue-50/30 to-white/70",
    rightHeaderBg: "bg-blue-50/70",
    rightComposerFocusBorder: "focus:border-blue-300",
    rightComposerFocusRing: "focus:ring-blue-100",
    incomingBubbleBg: "bg-blue-50/85",
    incomingBubbleBorder: "border-blue-100",
  },
  "tutor-connect": {
    title: "Tutor Connect Messages",
    searchPlaceholder: "Search Tutor Connect Messages",
    sidebarRailBg: "bg-gradient-to-b from-[#05263f] via-[#0c5a88] to-[#0ea5e9]",
    sidebarGlowTop: "bg-sky-300/35",
    sidebarGlowBottom: "bg-cyan-200/30",
    sidebarActiveTile: "border-sky-100/60 bg-white shadow-xl shadow-sky-900/30",
    sidebarActiveIconText: "text-sky-600",
    filterActiveBg: "bg-sky-500",
    filterActiveHoverBg: "hover:bg-sky-600",
    filterActiveShadow: "shadow-sky-200/60",
    accentText: "text-sky-500",
    accentSoftBg: "bg-sky-50",
    accentSoftBorder: "border-sky-200",
    accentDotBg: "bg-sky-500",
    selectedCardBorder: "border-sky-300",
    selectedCardShadow: "shadow-[0_14px_30px_rgba(14,165,233,0.2)]",
    unreadBadgeBg: "bg-sky-500",
    sendButtonBg: "bg-sky-500",
    sendButtonHoverBg: "hover:bg-sky-600",
    rightPanelBg: "bg-gradient-to-b from-sky-50/30 to-white/70",
    rightHeaderBg: "bg-sky-50/70",
    rightComposerFocusBorder: "focus:border-sky-300",
    rightComposerFocusRing: "focus:ring-sky-100",
    incomingBubbleBg: "bg-sky-50/85",
    incomingBubbleBorder: "border-sky-100",
  },
};

export default function MessagesHubPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<ChatModuleKey>("marketplace");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const currentUserId = useMemo(() => {
    try {
      const token = getToken();
      if (!token) {
        return null;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  }, []);

  const loadConversations = useCallback(async (options?: { silent?: boolean }) => {
    if (activeModule !== "marketplace") {
      setConversations([]);
      setSelectedConversationId(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      setError(null);
      const data = await getConversations();
      setConversations(data);
      setSelectedConversationId((current) => current ?? data[0]?.id ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load messages";
      setError(message);
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, [activeModule]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeModule !== "marketplace") {
      return;
    }
    const interval = window.setInterval(() => {
      loadConversations({ silent: true });
    }, 5000);
    return () => window.clearInterval(interval);
  }, [activeModule, loadConversations]);

  const filteredConversations = useMemo(() => {
    const roleFilteredConversations =
      activeFilter === "all"
        ? conversations
        : conversations.filter((conversation) => conversation.viewerRole === activeFilter);

    if (!searchText.trim()) {
      return roleFilteredConversations;
    }

    const term = searchText.toLowerCase();
    return roleFilteredConversations.filter(
      (conversation) =>
        conversation.participantName.toLowerCase().includes(term) ||
        conversation.productTitle.toLowerCase().includes(term) ||
        (conversation.lastMessage || "").toLowerCase().includes(term)
    );
  }, [conversations, searchText, activeFilter]);

  const selectedConversation =
    filteredConversations.find((conversation) => conversation.id === selectedConversationId) ??
    filteredConversations[0] ??
    null;

  useEffect(() => {
    if (activeModule !== "marketplace") {
      return;
    }

    if (!filteredConversations.length) {
      setSelectedConversationId(null);
      return;
    }

    const currentExists = filteredConversations.some((conversation) => conversation.id === selectedConversationId);
    if (!currentExists) {
      setSelectedConversationId(filteredConversations[0].id);
    }
  }, [activeModule, filteredConversations, selectedConversationId]);

  const loadSelectedConversation = useCallback(
    async (conversationId: string, options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsConversationLoading(true);
      }

      try {
        setChatError(null);
        const payload = await getConversation(conversationId);
        setMessages(payload.messages);
        await markAsRead(conversationId);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load conversation";
        setChatError(message);
      } finally {
        if (!options?.silent) {
          setIsConversationLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (activeModule !== "marketplace") {
      setMessages([]);
      setChatError(null);
      return;
    }

    if (!selectedConversationId) {
      setMessages([]);
      setChatError(null);
      return;
    }

    loadSelectedConversation(selectedConversationId);
  }, [activeModule, selectedConversationId, loadSelectedConversation]);

  useEffect(() => {
    if (activeModule !== "marketplace" || !selectedConversationId) {
      return;
    }

    const interval = window.setInterval(() => {
      loadSelectedConversation(selectedConversationId, { silent: true });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [activeModule, selectedConversationId, loadSelectedConversation]);

  const handleSendMessage = useCallback(async () => {
    if (!selectedConversationId || !messageText.trim() || isSending) {
      return;
    }

    try {
      setIsSending(true);
      setChatError(null);
      await sendMessage({
        conversationId: selectedConversationId,
        text: messageText.trim(),
      });
      setMessageText("");
      await loadSelectedConversation(selectedConversationId, { silent: true });
      await loadConversations({ silent: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send message";
      setChatError(message);
    } finally {
      setIsSending(false);
    }
  }, [selectedConversationId, messageText, isSending, loadSelectedConversation, loadConversations]);

  const formatRelativeTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Now";
    if (diffMin < 60) return `${diffMin}m`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}d`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const toDayKey = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const formatChatDateLabel = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    const messageKey = toDayKey(value);
    if (messageKey === todayKey) return "Today";
    if (messageKey === yesterdayKey) return "Yesterday";

    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredUnreadCount = filteredConversations.reduce((total, conversation) => total + conversation.unreadCount, 0);
  const activeTheme = moduleThemes[activeModule];

  return (
    <div className={`${oxanium.className} relative h-screen overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#e8ecff] to-[#dfe6ff] antialiased`}>
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />
      <Navbar />

      <main className="relative z-10 grid h-[calc(100vh-64px)] grid-cols-1 overflow-hidden lg:grid-cols-[112px_390px_1fr]">
        <aside className={`relative hidden overflow-hidden border-r border-slate-200/60 py-5 lg:flex lg:flex-col lg:items-center ${activeTheme.sidebarRailBg}`}>
          <div className={`pointer-events-none absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full blur-2xl ${activeTheme.sidebarGlowTop}`} />
          <div className={`pointer-events-none absolute bottom-10 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full blur-3xl ${activeTheme.sidebarGlowBottom}`} />

          <div className="relative z-10 flex w-full flex-col items-center gap-3 px-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-white/25"
            title="Back"
          >
            <ArrowLeft size={22} />
          </button>

          {chatModules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.key;
            return (
              <button
                key={module.key}
                type="button"
                onClick={() => setActiveModule(module.key)}
                className={`group relative flex h-[84px] w-[84px] flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all ${
                  isActive
                    ? `${activeTheme.sidebarActiveTile} ${activeTheme.sidebarActiveIconText}`
                    : "border-white/10 bg-white/5 text-white/90 hover:-translate-y-0.5 hover:bg-white/10"
                }`}
                title={module.label}
              >
                <Icon size={26} className={isActive ? activeTheme.sidebarActiveIconText : "text-white"} />
                <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] leading-none ${isActive ? activeTheme.sidebarActiveIconText : "text-white/80"}`}>
                  {module.label.split(" ")[0]}
                </span>
                {!module.enabled && (
                  <span className="absolute -right-1 -top-1 rounded-full border border-white/70 bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#020a47] shadow-sm">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
          </div>
        </aside>

        <section className="relative flex h-full flex-col overflow-hidden border-r border-slate-200/70 bg-white/75 p-5 backdrop-blur-md md:p-7">
          <div className="pointer-events-none absolute -right-20 top-10 h-52 w-52 rounded-full bg-indigo-200/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-sky-200/20 blur-3xl" />

          <div className="relative z-10 shrink-0 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[1.95rem] font-black leading-tight tracking-[-0.02em] text-slate-900">{activeTheme.title}</h1>
                <p className="mt-1 text-[13px] font-medium leading-5 text-slate-500">{filteredConversations.length} chats • {filteredUnreadCount} unread</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] shadow-sm ${activeTheme.accentSoftBg} ${activeTheme.accentSoftBorder} ${activeTheme.accentText}`}>
                Live
              </span>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200/60 ring-1 ring-white">
              <Search size={19} className="text-slate-400" />
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder={activeTheme.searchPlaceholder}
                className="w-full bg-transparent text-[14px] font-medium leading-5 text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400"
              />
            </label>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-sm shadow-slate-200/60">
              <div className="grid grid-cols-3 gap-1.5 text-[13px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                  className={`rounded-xl px-3 py-2.5 leading-5 transition ${
                  activeFilter === "all"
                    ? `${activeTheme.filterActiveBg} ${activeTheme.filterActiveHoverBg} text-white shadow-md ${activeTheme.filterActiveShadow}`
                      : "bg-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("buyer")}
                  className={`rounded-xl px-3 py-2.5 leading-5 transition ${
                  activeFilter === "buyer"
                    ? `${activeTheme.filterActiveBg} ${activeTheme.filterActiveHoverBg} text-white shadow-md ${activeTheme.filterActiveShadow}`
                      : "bg-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                As a buyer
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("seller")}
                  className={`rounded-xl px-3 py-2.5 leading-5 transition ${
                  activeFilter === "seller"
                    ? `${activeTheme.filterActiveBg} ${activeTheme.filterActiveHoverBg} text-white shadow-md ${activeTheme.filterActiveShadow}`
                      : "bg-transparent text-slate-700 hover:bg-slate-100"
                }`}
              >
                As a seller
              </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-color:#c7d2fe_transparent] [scrollbar-width:thin]">
            {activeModule !== "marketplace" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-[14px] leading-6 text-slate-600">
                {chatModules.find((module) => module.key === activeModule)?.label} chats will be added later.
              </div>
            )}

            {activeModule === "marketplace" && isLoading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-[14px] leading-6 text-slate-500">
                Loading conversations...
              </div>
            )}

            {activeModule === "marketplace" && !isLoading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-[14px] leading-6 text-red-600">{error}</div>
            )}

            {activeModule === "marketplace" && !isLoading && !error && filteredConversations.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-[14px] leading-6 text-slate-500">
                {activeFilter === "all"
                  ? "No marketplace conversations found."
                  : activeFilter === "buyer"
                    ? "No buyer conversations found."
                    : "No seller conversations found."}
              </div>
            )}

            {activeModule === "marketplace" &&
              filteredConversations.map((conversation) => {
                const isSelected = selectedConversation?.id === conversation.id;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? `${activeTheme.selectedCardBorder} bg-white ${activeTheme.selectedCardShadow} ring-1 ring-white`
                        : "border-slate-200 bg-white/90 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/70">
                        {conversation.productImage ? (
                          <Image src={conversation.productImage} alt={conversation.productTitle} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <MessageCircle size={20} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <p className="truncate text-[17px] font-bold leading-6 tracking-[-0.01em] text-slate-900">{conversation.participantName}</p>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="truncate text-[13px] font-semibold leading-5 text-slate-700">{conversation.productTitle}</p>
                        </div>
                        <p className="mt-1 truncate text-[13px] leading-5 text-slate-400 group-hover:text-slate-500">{conversation.lastMessage || "No messages yet"}</p>
                      </div>

                      <div className="ml-1 flex shrink-0 flex-col items-end gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                          {formatRelativeTime(conversation.lastMessageTime)}
                        </span>
                        {conversation.viewerRole && conversation.viewerRole !== "unknown" && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                            {conversation.viewerRole}
                          </span>
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className={`rounded-full px-2 py-1 text-[11px] font-bold leading-none text-white shadow-sm ${activeTheme.unreadBadgeBg}`}>
                            {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </section>

        <section className={`relative flex h-full min-h-0 flex-col overflow-hidden ${activeTheme.rightPanelBg}`}>
          <div className="pointer-events-none absolute inset-0 z-0 opacity-45">
            <Image
              src="/images/messages/message_light_BG.png"
              alt="Messages background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className={`pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full blur-3xl ${activeTheme.accentSoftBg}`} />
          <div className={`pointer-events-none absolute -bottom-8 left-4 h-28 w-28 rounded-full blur-2xl ${activeTheme.accentSoftBg}`} />

          <div className={`relative z-10 mx-4 mt-4 shrink-0 rounded-2xl border border-slate-200/80 p-4 shadow-sm backdrop-blur-md md:mx-5 md:mt-5 md:p-5 ${activeTheme.rightHeaderBg}`}>
            {selectedConversation ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
                    {selectedConversation.productImage ? (
                      <Image src={selectedConversation.productImage} alt={selectedConversation.productTitle} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <MessageCircle size={22} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-[1.35rem] font-bold leading-tight tracking-[-0.01em] text-slate-900">{selectedConversation.participantName}</h2>
                    <p className="text-[13px] font-medium leading-5 text-slate-600">{selectedConversation.productTitle}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${activeTheme.accentSoftBorder} ${activeTheme.accentSoftBg} ${activeTheme.accentText}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${activeTheme.accentDotBg}`} />
                    Active
                  </span>
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-slate-700">Select a {activeTheme.title.toLowerCase().replace(" messages", "")} conversation</h2>
            )}
          </div>

          <div className="relative z-10 min-h-0 flex-1 overflow-hidden p-4 md:p-5">
            {activeModule !== "marketplace" ? (
              <div className={`rounded-2xl border bg-white/80 p-6 text-[14px] leading-6 text-slate-600 shadow-sm ${activeTheme.accentSoftBorder}`}>
                {activeTheme.title} module chats will be enabled soon.
              </div>
            ) : selectedConversation ? (
              <div className="flex h-full min-h-0 flex-col gap-4">
                {isConversationLoading ? (
                  <div className={`rounded-2xl border bg-white/90 p-6 text-[14px] leading-6 text-slate-500 ${activeTheme.accentSoftBorder}`}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className={`rounded-2xl border bg-white/90 p-6 text-[14px] leading-6 text-slate-500 ${activeTheme.accentSoftBorder}`}>
                    No messages yet. Start the conversation.
                  </div>
                ) : (
                  <div className="min-h-0 flex-1 overflow-y-auto px-1 py-1">
                    <div className="space-y-3 pr-1">
                      {messages.map((message, index) => {
                        const isMine = message.senderId === currentUserId;
                        const previousMessage = index > 0 ? messages[index - 1] : null;
                        const showDateLabel =
                          !previousMessage || toDayKey(previousMessage.createdAt) !== toDayKey(message.createdAt);

                        return (
                          <div key={message.id} className="space-y-2">
                            {showDateLabel && (
                              <div className="flex justify-center py-1">
                                <span className="rounded-full border border-slate-200 bg-white/85 px-4 py-1 text-[12px] font-semibold text-slate-600 shadow-sm">
                                  {formatChatDateLabel(message.createdAt)}
                                </span>
                              </div>
                            )}

                            <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2 text-[14px] leading-6 shadow-sm ${
                                  isMine
                                    ? `rounded-br-none ${activeTheme.sendButtonBg} text-white`
                                    : `rounded-bl-none border ${activeTheme.incomingBubbleBorder} ${activeTheme.incomingBubbleBg} text-slate-900`
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                                <p
                                  className={`mt-1 text-[10px] font-medium uppercase tracking-[0.06em] ${
                                    isMine ? "text-right text-slate-300" : "text-left text-slate-500"
                                  }`}
                                >
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {chatError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] leading-6 text-red-600">{chatError}</div>}
              </div>
            ) : (
              <div className={`rounded-2xl border bg-white/80 p-6 text-[14px] leading-6 text-slate-600 ${activeTheme.accentSoftBorder}`}>
                No conversation selected.
              </div>
            )}
          </div>

          <div className={`relative z-10 mx-4 mb-4 flex items-center gap-3 rounded-2xl border border-white/55 bg-white/35 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl md:mx-5 md:mb-5`}>
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={activeModule !== "marketplace" || !selectedConversation || isConversationLoading}
              placeholder={
                activeModule !== "marketplace"
                  ? "Messaging will be available soon"
                  : selectedConversation
                    ? "Type your message..."
                    : "Select a conversation"
              }
              className={`flex-1 rounded-2xl border border-white/60 bg-white/65 px-5 py-3 text-[15px] font-medium leading-6 text-slate-700 outline-none placeholder:text-[14px] placeholder:font-normal placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-white/40 ${activeTheme.rightComposerFocusBorder} ${activeTheme.rightComposerFocusRing}`}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={
                activeModule !== "marketplace" ||
                !selectedConversation ||
                !messageText.trim() ||
                isSending ||
                isConversationLoading
              }
              className={`rounded-full p-3 text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-400 ${activeTheme.sendButtonBg} ${activeTheme.sendButtonHoverBg}`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
