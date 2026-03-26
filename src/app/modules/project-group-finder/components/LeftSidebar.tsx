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
  const badgeCls =
    badgeColor === "green"
      ? "bg-green-100 text-green-700"
      : badgeColor === "orange"
        ? "bg-orange-100 text-orange-700"
        : active
          ? "bg-blue-100 text-blue-700"
          : "border border-slate-200 bg-white text-slate-500";

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-4 py-3 text-left transition",
        active
          ? "border-blue-200 bg-blue-50 shadow-sm"
          : "border-slate-100 bg-white hover:bg-slate-50"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base">{icon}</span>
          <div className="min-w-0">
            <p className={cn("text-sm font-semibold truncate", active ? "text-blue-700" : "text-slate-900")}>
              {title}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{desc}</p>
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
  groupId,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
  onClose: () => void;
  groupId?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white px-3 py-4">
      <div className="mb-5 flex items-center justify-between px-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Group Space
        </p>
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          Close
        </button>
      </div>

      <div className="space-y-1.5">
        <NavItem
          active={active === "dashboard"}
          icon="🏠"
          title="Dashboard"
          desc="Find & match students"
          onClick={() => {
            onChange("dashboard");
            onClose();
            router.push("/project-group-finder");
          }}
        />

        <div className="my-2 border-t border-slate-100" />

        <NavItem
          active={active === "project-group"}
          icon="👥"
          title="Project Group"
          desc="View members & roles"
          badge="4"
          badgeColor="green"
          onClick={() => {
            onChange("project-group");
            onClose();
          }}
        />

        <NavItem
          active={active === "invites"}
          icon="✉️"
          title="Invites"
          desc="Sent & received"
          badge="3"
          badgeColor="orange"
          onClick={() => {
            onChange("invites");
            onClose();
            router.push("/project-group-finder");
          }}
        />

        <NavItem
          active={active === "chat"}
          icon="💬"
          title="Chat"
          desc="Real-time group chat"
          badge="Live"
          onClick={() => {
            onChange("chat");
            onClose();
          }}
        />
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">💡 Tip</p>
          <p className="mt-1 text-xs text-amber-700 leading-relaxed">
            Publish verified marks to increase smart matches.
          </p>
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
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-64px)] w-[260px] border-r border-slate-200 bg-white shadow-sm lg:block">
        <SidebarContent
          active={active}
          onChange={onChange}
          onClose={() => { }}
          groupId={groupId}
        />
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
              className="fixed left-0 top-0 z-50 h-full w-[75%] max-w-[300px] bg-white shadow-xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
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