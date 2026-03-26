"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { adminNavItems } from "../utils/admin-nav";

type AdminNavbarProps = {
  onOpenSidebar: () => void;
};

export function AdminNavbar({ onOpenSidebar }: AdminNavbarProps) {
  const pathname = usePathname();
  const currentPage = adminNavItems.find((item) => item.href === pathname);
  const title = currentPage?.title ?? "Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">UniNexus admin</p>
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:w-[320px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users, modules, or requests"
              className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-200"
            />
          </div>
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
              AD
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">Admin Director</p>
              <p className="truncate text-xs text-slate-500">ops@uninexus.edu</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
