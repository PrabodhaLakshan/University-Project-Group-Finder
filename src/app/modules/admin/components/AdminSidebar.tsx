"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
  UserRoundSearch,
  UsersRound,
  X,
} from "lucide-react";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  {
    title: "Dashboard",
    href: "/modules/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview & platform health",
    color: "#4B6CF7",
  },
  {
    title: "User Management",
    href: "/modules/admin/users",
    icon: Users,
    description: "Manage all user accounts",
    color: "#4B6CF7",
  },
  {
    title: "Project Groups",
    href: "/modules/admin/project-group-finder",
    icon: UsersRound,
    description: "Academic teams & group control",
    color: "#4B6CF7",
    isCore: true,
  },
  {
    title: "Uni Mart",
    href: "/modules/admin/uni-mart",
    icon: ShoppingBag,
    description: "Marketplace moderation",
    color: "#F97316",
    isCore: true,
  },
  {
    title: "Startup Connector",
    href: "/modules/admin/startup-finder",
    icon: Sparkles,
    description: "Startup profiles & gigs",
    color: "#6C4CF1",
    isCore: true,
  },
  {
    title: "Tutor Finder",
    href: "/modules/admin/tutor-connect",
    icon: UserRoundSearch,
    description: "Tutors, slots & feedback",
    color: "#22C55E",
    isCore: true,
  },
  {
    title: "Analytics",
    href: "/modules/admin/analytics",
    icon: BarChart3,
    description: "Usage & engagement stats",
    color: "#4B6CF7",
  },
  {
    title: "Settings",
    href: "/modules/admin/settings",
    icon: Settings,
    description: "Admin preferences",
    color: "#4B6CF7",
  },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin-login");
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="admin-sidebar-overlay"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      <aside className="admin-sidebar" style={{ transform: open ? "translateX(0)" : "" }}>
        {/* Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo-wrap">
            <div className="admin-sidebar-logo-img">
              <Image
                src="/images/navbar/UniNexus_nav_Logo_lightT.png"
                alt="UniNexus"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <div className="admin-sidebar-badge-row">
            <span className="admin-sidebar-badge">⚡ Admin Control Panel</span>
          </div>
          <button className="admin-sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={16} />
          </button>
        </div>

        {/* Section label */}
        <div className="admin-sidebar-nav">
          <p className="admin-sidebar-section-label">Navigation</p>

          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`admin-nav-item ${active ? "admin-nav-item--active" : ""}`}
                style={active ? { borderColor: `${item.color}30`, background: `${item.color}0D` } : {}}
              >
                <div
                  className="admin-nav-icon"
                  style={{
                    background: active ? `${item.color}18` : "#F4F6FB",
                    color: active ? item.color : "#64748b",
                    border: `1px solid ${active ? item.color + "30" : "#E2E8F0"}`,
                  }}
                >
                  <Icon size={15} />
                </div>
                <div className="admin-nav-text">
                  <span
                    className="admin-nav-title"
                    style={{ color: active ? item.color : "#1e293b" }}
                  >
                    {item.title}
                    {item.isCore && (
                      <span
                        className="admin-core-dot"
                        style={{ background: item.color }}
                      />
                    )}
                  </span>
                  <span className="admin-nav-desc">{item.description}</span>
                </div>
                <ChevronRight
                  size={13}
                  style={{ color: active ? item.color : "#cbd5e1", flexShrink: 0 }}
                />
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">UN</div>
            <div>
              <p className="admin-sidebar-username">UniNexus Admin</p>
              <p className="admin-sidebar-email">uniadmin@gmail.com</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <style>{`
        .admin-sidebar-overlay {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(15,23,42,0.4);
          backdrop-filter: blur(4px);
          transition: opacity 0.3s;
        }
        @media (min-width: 1024px) { .admin-sidebar-overlay { display: none; } }

        .admin-sidebar {
          position: fixed; inset-y: 0; left: 0; z-index: 50;
          width: 280px; display: flex; flex-direction: column;
          background: #ffffff;
          border-right: 1px solid #E2E8F0;
          box-shadow: 4px 0 24px rgba(15,23,42,0.06);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @media (min-width: 1024px) {
          .admin-sidebar { transform: translateX(0) !important; }
        }

        .admin-sidebar-header {
          padding: 1.25rem 1.25rem 1rem;
          border-bottom: 1px solid #F1F5F9;
          position: relative;
        }
        .admin-sidebar-logo-wrap {
          position: relative;
          height: 38px; width: 160px;
          margin-bottom: 0.625rem;
        }
        .admin-sidebar-logo-img { width: 100%; height: 100%; position: relative; }
        .admin-sidebar-badge-row { }
        .admin-sidebar-badge {
          display: inline-block;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: linear-gradient(135deg, #4B6CF7, #F97316);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .admin-sidebar-close {
          position: absolute; top: 1.1rem; right: 1.1rem;
          background: #F4F6FB; border: 1px solid #E2E8F0;
          border-radius: 8px; padding: 6px; color: #94a3b8;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center;
        }
        .admin-sidebar-close:hover { background: #ffe8d6; color: #F97316; }
        @media (min-width: 1024px) { .admin-sidebar-close { display: none; } }

        .admin-sidebar-nav {
          flex: 1; overflow-y: auto;
          padding: 0.875rem 0.875rem;
          display: flex; flex-direction: column; gap: 2px;
          scrollbar-width: thin;
          scrollbar-color: #E2E8F0 transparent;
        }

        .admin-sidebar-section-label {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #94a3b8; margin: 0 0.5rem 0.5rem;
        }

        .admin-nav-item {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.55rem 0.625rem;
          border-radius: 12px;
          border: 1px solid transparent;
          text-decoration: none;
          transition: all 0.18s;
          cursor: pointer;
        }
        .admin-nav-item:hover:not(.admin-nav-item--active) {
          background: #F8FAFF;
          border-color: #E2E8F0;
        }

        .admin-nav-icon {
          width: 32px; height: 32px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.18s;
        }
        .admin-nav-text { flex: 1; min-width: 0; }
        .admin-nav-title {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.8rem; font-weight: 600;
          white-space: nowrap; transition: color 0.18s;
        }
        .admin-nav-desc {
          display: block; font-size: 10px; color: #94a3b8;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-top: 1px;
        }
        .admin-core-dot {
          width: 5px; height: 5px; border-radius: 50%;
          display: inline-block; flex-shrink: 0;
        }

        .admin-sidebar-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid #F1F5F9;
          display: flex; flex-direction: column; gap: 0.625rem;
        }
        .admin-sidebar-user {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.625rem 0.75rem;
          background: #F8FAFF; border: 1px solid #E2E8F0;
          border-radius: 12px;
        }
        .admin-sidebar-avatar {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #4B6CF7, #6C4CF1);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: white;
        }
        .admin-sidebar-username {
          font-size: 0.78rem; font-weight: 700; color: #1e293b; margin: 0;
        }
        .admin-sidebar-email {
          font-size: 10px; color: #94a3b8; margin: 0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;
        }
        .admin-logout-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 0.55rem;
          background: #FFF5F5; border: 1px solid #FECACA;
          border-radius: 10px; color: #EF4444;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .admin-logout-btn:hover { background: #FEE2E2; border-color: #FCA5A5; }
      `}</style>
    </>
  );
}
