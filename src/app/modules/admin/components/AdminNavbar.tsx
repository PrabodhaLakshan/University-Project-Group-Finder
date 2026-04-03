"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";

const navTitles: Record<string, string> = {
  "/modules/admin/dashboard": "Dashboard",
  "/modules/admin/users": "User Management",
  "/modules/admin/project-group-finder": "Project Groups",
  "/modules/admin/uni-mart": "Uni Mart",
  "/modules/admin/startup-finder": "Startup Connector",
  "/modules/admin/tutor-connect": "Tutor Finder",
  "/modules/admin/analytics": "Analytics",
  "/modules/admin/settings": "Settings",
};

const navColors: Record<string, string> = {
  "/modules/admin/dashboard": "#4B6CF7",
  "/modules/admin/users": "#4B6CF7",
  "/modules/admin/project-group-finder": "#4B6CF7",
  "/modules/admin/uni-mart": "#F97316",
  "/modules/admin/startup-finder": "#6C4CF1",
  "/modules/admin/tutor-connect": "#22C55E",
  "/modules/admin/analytics": "#4B6CF7",
  "/modules/admin/settings": "#4B6CF7",
};

type AdminNavbarProps = {
  onOpenSidebar: () => void;
};

export function AdminNavbar({ onOpenSidebar }: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = navTitles[pathname] ?? "Admin";
  const accentColor = navColors[pathname] ?? "#4B6CF7";
  const [adminEmail, setAdminEmail] = useState("uniadmin@gmail.com");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.email) setAdminEmail(parsed.email);
      } catch { /* ignore */ }
    }
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin-login");
  }

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-inner">
        {/* Left */}
        <div className="admin-navbar-left">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="admin-navbar-menu-btn"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="admin-navbar-eyebrow">UNINEXUS ADMIN</p>
            <h1
              className="admin-navbar-title"
              style={{ color: accentColor }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="admin-navbar-right">
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search users, modules..."
              className="admin-search-input"
              id="admin-global-search"
            />
          </div>

          <div className="admin-navbar-clock">{currentTime}</div>

          <button type="button" className="admin-navbar-icon-btn" aria-label="Notifications">
            <Bell size={17} />
            <span
              className="admin-notification-dot"
              style={{ background: "#F97316" }}
            />
          </button>

          <div className="admin-navbar-user">
            <div className="admin-navbar-avatar">UN</div>
            <div className="admin-navbar-userinfo">
              <p className="admin-navbar-username">UniNexus Admin</p>
              <p className="admin-navbar-useremail">{adminEmail}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="admin-navbar-logout"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .admin-navbar {
          position: sticky; top: 0; z-index: 30;
          background: #ffffff;
          border-bottom: 1px solid #E2E8F0;
          box-shadow: 0 1px 12px rgba(15,23,42,0.06);
        }
        .admin-navbar-inner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; padding: 0.875rem 1.5rem;
          flex-wrap: wrap;
        }
        .admin-navbar-left { display: flex; align-items: center; gap: 0.75rem; }
        .admin-navbar-menu-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 11px;
          background: #F4F6FB; border: 1px solid #E2E8F0;
          color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .admin-navbar-menu-btn:hover {
          background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7;
        }
        @media (min-width: 1024px) { .admin-navbar-menu-btn { display: none; } }

        .admin-navbar-eyebrow {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #94a3b8; margin: 0;
        }
        .admin-navbar-title {
          font-size: 1.25rem; font-weight: 800; margin: 0;
          letter-spacing: -0.02em; line-height: 1.3;
        }

        .admin-navbar-right {
          display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap;
        }

        .admin-search-wrap { position: relative; display: flex; align-items: center; }
        .admin-search-icon {
          position: absolute; left: 11px; color: #94a3b8; pointer-events: none;
        }
        .admin-search-input {
          height: 38px; padding: 0 1rem 0 34px;
          background: #F4F6FB; border: 1px solid #E2E8F0;
          border-radius: 11px; color: #1e293b; font-size: 0.82rem; outline: none;
          width: 210px; transition: all 0.2s;
        }
        .admin-search-input::placeholder { color: #cbd5e1; }
        .admin-search-input:focus {
          border-color: #4B6CF7; background: #EEF2FF;
          box-shadow: 0 0 0 3px rgba(75,108,247,0.1);
          width: 240px;
        }
        @media (max-width: 768px) { .admin-search-wrap { display: none; } }

        .admin-navbar-clock {
          font-size: 0.78rem; font-weight: 600;
          color: #94a3b8; padding: 0 0.375rem;
          white-space: nowrap;
        }
        @media (max-width: 640px) { .admin-navbar-clock { display: none; } }

        .admin-navbar-icon-btn {
          position: relative; width: 38px; height: 38px;
          border-radius: 11px; background: #F4F6FB;
          border: 1px solid #E2E8F0; color: #64748b;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .admin-navbar-icon-btn:hover {
          background: #FFF7ED; border-color: #FED7AA; color: #F97316;
        }
        .admin-notification-dot {
          position: absolute; top: 8px; right: 8px;
          width: 7px; height: 7px; border-radius: 50%;
          box-shadow: 0 0 0 2px #fff;
        }

        .admin-navbar-user {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.35rem 0.75rem 0.35rem 0.4rem;
          background: #F4F6FB; border: 1px solid #E2E8F0;
          border-radius: 12px; min-width: 0;
        }
        .admin-navbar-avatar {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, #4B6CF7, #6C4CF1);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: white;
        }
        .admin-navbar-userinfo { min-width: 0; }
        .admin-navbar-username {
          font-size: 0.76rem; font-weight: 700; color: #1e293b;
          white-space: nowrap; margin: 0;
        }
        .admin-navbar-useremail {
          font-size: 9.5px; color: #94a3b8; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis; max-width: 130px; margin: 0;
        }
        @media (max-width: 640px) { .admin-navbar-userinfo { display: none; } }

        .admin-navbar-logout {
          background: none; border: none; cursor: pointer;
          color: #94a3b8; padding: 4px; flex-shrink: 0;
          display: flex; align-items: center; border-radius: 6px;
          transition: all 0.2s;
        }
        .admin-navbar-logout:hover {
          background: #FEE2E2; color: #EF4444;
        }
      `}</style>
    </header>
  );
}
