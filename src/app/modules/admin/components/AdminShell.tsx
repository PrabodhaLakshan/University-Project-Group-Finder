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
    <div className="admin-shell-root">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-shell-main">
        <AdminNavbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="admin-shell-content">{children}</main>
      </div>

      <style>{`
        .admin-shell-root {
          min-height: 100vh;
          background: #F4F6FB;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .admin-shell-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 1024px) {
          .admin-shell-main {
            padding-left: 280px;
          }
        }
        .admin-shell-content {
          flex: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        @media (min-width: 640px) {
          .admin-shell-content { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
