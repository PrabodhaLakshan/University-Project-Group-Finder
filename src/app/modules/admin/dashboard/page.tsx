"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Flag,
  ShoppingBag,
  Sparkles,
  UserCog,
  Users,
  UsersRound,
  UserRoundSearch,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

const metrics = [
  { title: "Total Users", value: "18,420", change: "+8.4% this month", trend: "up" as const, icon: UserCog, color: "#4B6CF7", bg: "#EEF2FF" },
  { title: "Active Listings", value: "642", change: "+41 today", trend: "up" as const, icon: ShoppingBag, color: "#F97316", bg: "#FFF7ED" },
  { title: "Startups", value: "138", change: "+6 pending", trend: "up" as const, icon: BriefcaseBusiness, color: "#6C4CF1", bg: "#F5F3FF" },
  { title: "Tutors", value: "94", change: "12 on waitlist", trend: "neutral" as const, icon: BookOpenCheck, color: "#FBBF24", bg: "#FFFBEB" },
  { title: "Bookings", value: "1,286", change: "+12.1% week", trend: "up" as const, icon: CheckCircle2, color: "#22C55E", bg: "#F0FDF4" },
  { title: "Reports", value: "27", change: "-3 since yesterday", trend: "down" as const, icon: Flag, color: "#EF4444", bg: "#FFF5F5" },
];

const coreModules = [
  {
    title: "Project Group Finder",
    description: "Manage academic teams, monitor group health, and oversee collaboration requests.",
    href: "/modules/admin/project-group-finder",
    icon: UsersRound,
    color: "#4B6CF7",
    bg: "#EEF2FF",
    border: "#C7D2FE",
    stat: { label: "Active Groups", value: "284" },
  },
  {
    title: "Uni Mart",
    description: "Moderate marketplace listings, resolve disputes, and review flagged items.",
    href: "/modules/admin/uni-mart",
    icon: ShoppingBag,
    color: "#F97316",
    bg: "#FFF7ED",
    border: "#FED7AA",
    stat: { label: "Live Listings", value: "642" },
  },
  {
    title: "Startup Connector",
    description: "Verify startup profiles, review gig posts, and manage founder applications.",
    href: "/modules/admin/startup-finder",
    icon: Sparkles,
    color: "#6C4CF1",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    stat: { label: "Startups", value: "138" },
  },
  {
    title: "Tutor Finder",
    description: "Oversee tutor slots, review feedback, and manage booking requests.",
    href: "/modules/admin/tutor-connect",
    icon: UserRoundSearch,
    color: "#22C55E",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    stat: { label: "Active Tutors", value: "94" },
  },
];

const recentActivity = [
  { id: 1, title: "Laptop listing hidden", desc: "A moderator removed a repeated scam report from Uni Mart.", time: "8 min ago", color: "#F97316", icon: AlertTriangle },
  { id: 2, title: "Startup verified", desc: "GreenGrid Labs completed its founder verification flow.", time: "23 min ago", color: "#22C55E", icon: CheckCircle2 },
  { id: 3, title: "Tutor suspended", desc: "Missed-session policy triggered a temporary suspension.", time: "52 min ago", color: "#EF4444", icon: Flag },
  { id: 4, title: "New group reported", desc: "AI capstone group flagged for duplicate topic submissions.", time: "1 hr ago", color: "#94a3b8", icon: Clock },
];

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <ArrowUpRight size={12} />;
  if (trend === "down") return <ArrowDownRight size={12} />;
  return <ArrowRight size={12} />;
}

export default function AdminDashboardPage() {
  return (
    <div className="ad-root">
      {/* Header */}
      <div className="ad-header">
        <div>
          <p className="ad-eyebrow">⚡ Platform Operations</p>
          <h2 className="ad-title">UniNexus Control Panel</h2>
          <p className="ad-subtitle">
            Manage all 4 core modules, moderate content, and track platform growth in real time.
          </p>
        </div>
        <Link href="/modules/admin/analytics" className="ad-analytics-btn">
          <BarChart3 size={15} />
          View Analytics
        </Link>
      </div>

      {/* Metrics */}
      <section className="ad-metrics-grid">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="ad-metric-card" style={{ borderColor: `${m.color}25` }}>
              <div className="ad-metric-top">
                <div>
                  <p className="ad-metric-label">{m.title}</p>
                  <p className="ad-metric-value" style={{ color: m.color }}>{m.value}</p>
                </div>
                <div className="ad-metric-icon" style={{ background: m.bg, color: m.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div
                className="ad-metric-change"
                style={{
                  color: m.trend === "down" ? "#DC2626" : m.trend === "up" ? "#16a34a" : "#6B7280",
                  background: m.trend === "down" ? "#FFF5F5" : m.trend === "up" ? "#F0FDF4" : "#F8FAFF",
                  border: `1px solid ${m.trend === "down" ? "#FECACA" : m.trend === "up" ? "#BBF7D0" : "#E2E8F0"}`,
                }}
              >
                <TrendIcon trend={m.trend} />
                {m.change}
              </div>
            </div>
          );
        })}
      </section>

      {/* Core Modules */}
      <section className="ad-section">
        <div className="ad-section-head">
          <h3 className="ad-section-title">Core Module Controls</h3>
          <p className="ad-section-sub">Manage the 4 main platform features</p>
        </div>
        <div className="ad-modules-grid">
          {coreModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="ad-module-card"
                style={{ borderColor: mod.border, background: "white" }}
              >
                <div className="ad-module-top">
                  <div className="ad-module-icon" style={{ background: mod.bg, color: mod.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="ad-module-stat">
                    <span className="ad-module-stat-val" style={{ color: mod.color }}>{mod.stat.value}</span>
                    <span className="ad-module-stat-lbl">{mod.stat.label}</span>
                  </div>
                </div>
                <div className="ad-module-bar" style={{ background: mod.bg }}>
                  <div className="ad-module-bar-inner" style={{ background: mod.color }} />
                </div>
                <h4 className="ad-module-title" style={{ color: "#0f172a" }}>{mod.title}</h4>
                <p className="ad-module-desc">{mod.description}</p>
                <div className="ad-module-link" style={{ color: mod.color }}>
                  Manage <ArrowUpRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom */}
      <div className="ad-bottom-grid">
        <div className="ad-card">
          <h3 className="ad-section-title" style={{ marginBottom: "0.875rem" }}>Quick Actions</h3>
          <div className="ad-quicklinks">
            {[
              { label: "View All Users", href: "/modules/admin/users", icon: Users, color: "#4B6CF7", bg: "#EEF2FF" },
              { label: "Platform Analytics", href: "/modules/admin/analytics", icon: BarChart3, color: "#6C4CF1", bg: "#F5F3FF" },
              { label: "Admin Settings", href: "/modules/admin/settings", icon: Activity, color: "#F97316", bg: "#FFF7ED" },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <Link key={q.href} href={q.href} className="ad-quicklink-item">
                  <div className="ad-quicklink-icon" style={{ background: q.bg, color: q.color }}>
                    <Icon size={15} />
                  </div>
                  <span>{q.label}</span>
                  <ArrowRight size={13} className="ad-quicklink-arrow" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="ad-card">
          <h3 className="ad-section-title" style={{ marginBottom: "0.875rem" }}>Recent Activity</h3>
          <div className="ad-activity-list">
            {recentActivity.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="ad-activity-item">
                  <div className="ad-activity-dot" style={{ background: `${a.color}18`, color: a.color, border: `1px solid ${a.color}30` }}>
                    <Icon size={12} />
                  </div>
                  <div className="ad-activity-text">
                    <p className="ad-activity-title">{a.title}</p>
                    <p className="ad-activity-desc">{a.desc}</p>
                  </div>
                  <span className="ad-activity-time">{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .ad-root { display: flex; flex-direction: column; gap: 1.75rem; }

        .ad-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
        .ad-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4B6CF7; margin: 0 0 0.3rem; }
        .ad-title { font-size: 1.75rem; font-weight: 900; color: #0f172a; margin: 0 0 0.3rem; letter-spacing: -0.02em; }
        .ad-subtitle { color: #64748b; font-size: 0.85rem; margin: 0; max-width: 480px; }
        .ad-analytics-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 0.6rem 1.25rem; border-radius: 12px;
          background: linear-gradient(135deg, #4B6CF7, #6C4CF1);
          color: white; font-size: 0.83rem; font-weight: 700;
          text-decoration: none; white-space: nowrap;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(75,108,247,0.3);
        }
        .ad-analytics-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .ad-metrics-grid { display: grid; gap: 0.875rem; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); }
        .ad-metric-card {
          background: white; border: 1.5px solid;
          border-radius: 18px; padding: 1.25rem;
          display: flex; flex-direction: column; gap: 0.875rem;
          transition: box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 1px 8px rgba(15,23,42,0.06);
        }
        .ad-metric-card:hover { box-shadow: 0 4px 24px rgba(15,23,42,0.1); transform: translateY(-2px); }
        .ad-metric-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; }
        .ad-metric-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ad-metric-label { font-size: 11px; color: #64748b; font-weight: 600; margin: 0 0 0.3rem; }
        .ad-metric-value { font-size: 1.6rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .ad-metric-change {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600;
          padding: 3px 10px; border-radius: 100px;
        }

        .ad-section { display: flex; flex-direction: column; gap: 0.875rem; }
        .ad-section-head { }
        .ad-section-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.2rem; letter-spacing: -0.01em; }
        .ad-section-sub { font-size: 0.8rem; color: #64748b; margin: 0; }

        .ad-modules-grid { display: grid; gap: 0.875rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        .ad-module-card {
          border: 1.5px solid; border-radius: 20px; padding: 1.375rem;
          text-decoration: none; display: flex; flex-direction: column; gap: 0.75rem;
          transition: box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 1px 8px rgba(15,23,42,0.06);
        }
        .ad-module-card:hover { box-shadow: 0 6px 28px rgba(15,23,42,0.12); transform: translateY(-2px); }
        .ad-module-top { display: flex; align-items: center; justify-content: space-between; }
        .ad-module-icon { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .ad-module-stat { text-align: right; }
        .ad-module-stat-val { display: block; font-size: 1.5rem; font-weight: 900; line-height: 1; letter-spacing: -0.02em; }
        .ad-module-stat-lbl { display: block; font-size: 10px; color: #64748b; font-weight: 600; margin-top: 2px; }
        .ad-module-bar { height: 4px; border-radius: 100px; overflow: hidden; }
        .ad-module-bar-inner { height: 100%; width: 65%; border-radius: 100px; }
        .ad-module-title { font-size: 0.95rem; font-weight: 800; margin: 0; letter-spacing: -0.01em; }
        .ad-module-desc { font-size: 0.8rem; color: #64748b; margin: 0; line-height: 1.55; flex: 1; }
        .ad-module-link { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 700; }

        .ad-bottom-grid { display: grid; gap: 0.875rem; grid-template-columns: 1fr 1.6fr; }
        @media (max-width: 768px) { .ad-bottom-grid { grid-template-columns: 1fr; } }

        .ad-card {
          background: white; border: 1px solid #E2E8F0;
          border-radius: 20px; padding: 1.375rem;
          box-shadow: 0 1px 8px rgba(15,23,42,0.06);
        }

        .ad-quicklinks { display: flex; flex-direction: column; gap: 0.5rem; }
        .ad-quicklink-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem; border-radius: 13px;
          background: #F8FAFF; border: 1px solid #E2E8F0;
          text-decoration: none; color: #1e293b;
          font-size: 0.83rem; font-weight: 600;
          transition: all 0.18s;
        }
        .ad-quicklink-item:hover { background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7; }
        .ad-quicklink-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ad-quicklink-arrow { margin-left: auto; color: #94a3b8; }

        .ad-activity-list { display: flex; flex-direction: column; gap: 0.625rem; }
        .ad-activity-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.75rem; border-radius: 13px;
          background: #F8FAFF; border: 1px solid #F1F5F9;
        }
        .ad-activity-dot { width: 28px; height: 28px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ad-activity-text { flex: 1; min-width: 0; }
        .ad-activity-title { font-size: 0.8rem; font-weight: 700; color: #1e293b; margin: 0 0 2px; }
        .ad-activity-desc { font-size: 10.5px; color: #64748b; margin: 0; line-height: 1.4; }
        .ad-activity-time { font-size: 10px; color: #94a3b8; white-space: nowrap; padding-top: 3px; flex-shrink: 0; }
      `}</style>
    </div>
  );
}
