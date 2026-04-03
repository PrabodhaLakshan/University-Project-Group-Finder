"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export type NavKey = "dashboard" | "project-group" | "invites" | "chat";

function cn(...c: Array<string | undefined | false>) {
  return c.filter(Boolean).join(" ");
}

function NavItem({
  active,
  icon,
  title,
  desc,
  badge,
  badgeColor = "default",
  onClick,
}: {
  active?: boolean;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  badgeColor?: "default" | "green" | "orange";
  onClick?: () => void;
}) {
  const iconColor = active ? "text-blue-600" : "text-slate-500";

  const badgeCls =
    badgeColor === "green"
      ? "bg-emerald-100 text-emerald-700"
      : badgeColor === "orange"
        ? "bg-amber-100 text-amber-700"
        : active
          ? "bg-blue-100 text-blue-700"
          : "border border-slate-200 bg-white text-slate-500";

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-4 py-3 text-left transition backdrop-blur-sm duration-200",
        active
          ? "border-blue-300/90 bg-white/95 shadow-[0_12px_22px_rgba(37,99,235,0.18)]"
          : "border-white/70 bg-white/65 hover:bg-white/92 hover:shadow-[0_10px_20px_rgba(15,23,42,0.12)]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2.5">
          <span className={cn("grid h-6 w-6 place-items-center rounded-full text-xs font-bold", iconColor, active ? "bg-blue-100" : "bg-white/70")}>
            {icon}
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm font-semibold",
                active ? "text-blue-700" : "text-slate-900"
              )}
            >
              {title}
            </p>
            <p className="truncate text-[11px] text-slate-500">{desc}</p>
          </div>
        </div>
        {badge && (
          <span className={cn("flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", badgeCls)}>
            {badge}
          </span>
        )}
      </div>
    </motion.button>
  );
}

function SidebarContent({
  active,
  onChange,
  onClose,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
  onClose: () => void;
  groupId?: string;
}) {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-100/85 via-indigo-50/70 to-violet-100/75" />
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 top-10 h-48 w-48 rounded-full border-[24px] border-blue-300/20" />
        <div className="absolute -right-14 top-44 h-56 w-56 rounded-full border-[28px] border-violet-300/20" />
        <div className="absolute bottom-20 left-4 h-40 w-56 rounded-[100px] border-[18px] border-amber-200/20" />
      </div>

      <div className="relative z-10 flex h-full flex-col overflow-y-auto px-3 py-4">
        <div className="mb-5 flex items-center justify-between px-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Group Space</p>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            Close
          </button>
        </div>

        <div className="rounded-2xl border border-white/75 bg-white/45 p-2 shadow-[0_12px_28px_rgba(30,41,59,0.08)]">
        <div className="space-y-1.5">
          <NavItem
            active={active === "dashboard"}
            icon="D"
            title="Dashboard"
            desc="Find and match students"
            onClick={() => {
              onChange("dashboard");
              onClose();
              if (window.location.pathname !== "/project-group-finder") {
                router.push("/project-group-finder?tab=dashboard");
              }
            }}
          />

          <div className="my-2 border-t border-white/60" />

          <NavItem
            active={active === "project-group"}
            icon="G"
            title="Project Group"
            desc="View members and roles"
            badge="4"
            badgeColor="green"
            onClick={() => {
              onChange("project-group");
              onClose();
              if (window.location.pathname !== "/project-group-finder") {
                router.push("/project-group-finder?tab=project-group");
              }
            }}
          />

          <NavItem
            active={active === "invites"}
            icon="I"
            title="Invites"
            desc="Sent and received"
            badge="3"
            badgeColor="orange"
            onClick={() => {
              onChange("invites");
              onClose();
              if (window.location.pathname !== "/project-group-finder") {
                router.push("/project-group-finder?tab=invites");
              }
            }}
          />

          <NavItem
            active={active === "chat"}
            icon="C"
            title="Chat"
            desc="Real-time group chat"
            badge="Live"
            onClick={() => {
              onChange("chat");
              onClose();
              if (window.location.pathname !== "/project-group-finder") {
                router.push("/project-group-finder?tab=chat");
              }
            }}
          />
        </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="rounded-2xl border border-amber-100/80 bg-white/65 p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold text-amber-800">Tip</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Publish verified marks to increase smart matches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeftSidebar({
  active,
  onChange,
  mobileOpen,
  setMobileOpen,
  groupId,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  groupId?: string;
}) {
  return (
    <>
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-64px)] w-[260px] border-r border-blue-200/80 bg-white/75 backdrop-blur-xl shadow-[12px_0_34px_rgba(15,23,42,0.12)] lg:block">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-blue-400/40 via-indigo-300/45 to-sky-300/35" />
        <SidebarContent active={active} onChange={onChange} onClose={() => {}} groupId={groupId} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-[75%] max-w-[300px] border-r border-blue-200/70 bg-white/85 backdrop-blur-2xl shadow-2xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-blue-400/40 via-indigo-300/45 to-sky-300/35" />
              <SidebarContent
                active={active}
                onChange={onChange}
                onClose={() => setMobileOpen(false)}
                groupId={groupId}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
