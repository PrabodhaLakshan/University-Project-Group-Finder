"use client";

import { ReactNode, useState } from "react";

import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[280px]">
        <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
