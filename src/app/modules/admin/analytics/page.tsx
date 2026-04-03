import { BarChart3, TrendingUp, Users, ShoppingBag, Sparkles, UserRoundSearch, UsersRound } from "lucide-react";
import { moduleUsageStats } from "../utils/mock-data";

const moduleConfig: Record<string, { color: string; bg: string; border: string; icon: typeof BarChart3 }> = {
  "Uni Mart": { color: "#F97316", bg: "#FFF7ED", border: "#FED7AA", icon: ShoppingBag },
  "Startup Finder": { color: "#6C4CF1", bg: "#F5F3FF", border: "#DDD6FE", icon: Sparkles },
  "Project Group Finder": { color: "#4B6CF7", bg: "#EEF2FF", border: "#C7D2FE", icon: UsersRound },
  "Tutor Connect": { color: "#22C55E", bg: "#F0FDF4", border: "#BBF7D0", icon: UserRoundSearch },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="an-root">
      <div className="an-header">
        <div>
          <p className="an-eyebrow">📊 Analytics</p>
          <h2 className="an-title">Platform Analytics</h2>
          <p className="an-subtitle">Track user growth, module adoption, and engagement across the UniNexus platform.</p>
        </div>
      </div>

      {/* Overall stats */}
      <div className="an-stats">
        {[
          { label: "Total Users", value: "18,420", change: "+8.4%", icon: Users, color: "#4B6CF7", bg: "#EEF2FF" },
          { label: "Monthly Active", value: "12,840", change: "+5.2%", icon: TrendingUp, color: "#22C55E", bg: "#F0FDF4" },
          { label: "Total Modules", value: "4", change: "All active", icon: BarChart3, color: "#F97316", bg: "#FFF7ED" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="an-stat" style={{ borderColor: `${s.color}25` }}>
              <div className="an-stat-icon" style={{ background: s.bg, color: s.color }}><Icon size={20} /></div>
              <div>
                <p className="an-stat-val" style={{ color: s.color }}>{s.value}</p>
                <p className="an-stat-lbl">{s.label}</p>
                <p className="an-stat-chg" style={{ color: s.color }}>{s.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module performance */}
      <div>
        <h3 className="an-section-title">Module Performance</h3>
        <div className="an-module-grid">
          {moduleUsageStats.map((stat) => {
            const cfg = moduleConfig[stat.module] ?? { color: "#4B6CF7", bg: "#EEF2FF", border: "#C7D2FE", icon: BarChart3 };
            const Icon = cfg.icon;
            const activeNum = parseInt(stat.activeUsers.replace(/,/g, ""));
            const pct = Math.min((activeNum / 8000) * 100, 100);

            return (
              <div key={stat.module} className="an-module-card" style={{ borderColor: cfg.border }}>
                <div className="an-module-top">
                  <div className="an-module-icon" style={{ background: cfg.bg, color: cfg.color }}>
                    <Icon size={18} />
                  </div>
                  <span className="an-module-name" style={{ color: "#0f172a" }}>{stat.module}</span>
                </div>
                <div className="an-module-stats">
                  <div>
                    <p className="an-module-val" style={{ color: cfg.color }}>{stat.activeUsers}</p>
                    <p className="an-module-lbl">Active Users</p>
                  </div>
                  <div>
                    <p className="an-module-val" style={{ color: cfg.color }}>{stat.conversion}</p>
                    <p className="an-module-lbl">Conversion</p>
                  </div>
                  <div>
                    <p className="an-module-val" style={{ color: "#d97706" }}>{stat.satisfaction}</p>
                    <p className="an-module-lbl">Satisfaction</p>
                  </div>
                </div>
                <div className="an-progress-wrap">
                  <div className="an-progress-bar">
                    <div className="an-progress-fill" style={{ width: `${pct}%`, background: cfg.color }} />
                  </div>
                  <span className="an-progress-pct">{pct.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .an-root { display: flex; flex-direction: column; gap: 1.75rem; }
        .an-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4B6CF7; margin: 0 0 0.25rem; }
        .an-title { font-size: 1.65rem; font-weight: 900; color: #0f172a; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .an-subtitle { color: #64748b; font-size: 0.83rem; margin: 0; }
        .an-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.875rem; }
        .an-stat { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem; background: white; border: 1.5px solid; border-radius: 16px; box-shadow: 0 1px 8px rgba(15,23,42,0.06); }
        .an-stat-icon { width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .an-stat-val { font-size: 1.45rem; font-weight: 800; margin: 0 0 2px; letter-spacing: -0.02em; }
        .an-stat-lbl { font-size: 11px; color: #64748b; font-weight: 600; margin: 0 0 2px; }
        .an-stat-chg { font-size: 10.5px; font-weight: 700; margin: 0; }
        .an-section-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.875rem; letter-spacing: -0.01em; }
        .an-module-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(255px, 1fr)); gap: 0.875rem; }
        .an-module-card {
          background: white; border: 1.5px solid; border-radius: 18px;
          padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
          box-shadow: 0 1px 8px rgba(15,23,42,0.06);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .an-module-card:hover { box-shadow: 0 4px 24px rgba(15,23,42,0.1); transform: translateY(-2px); }
        .an-module-top { display: flex; align-items: center; gap: 0.75rem; }
        .an-module-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .an-module-name { font-size: 0.9rem; font-weight: 800; }
        .an-module-stats { display: flex; gap: 1.25rem; }
        .an-module-val { font-size: 1.05rem; font-weight: 800; margin: 0 0 2px; }
        .an-module-lbl { font-size: 10px; color: #64748b; font-weight: 600; margin: 0; }
        .an-progress-wrap { display: flex; align-items: center; gap: 0.75rem; }
        .an-progress-bar { flex: 1; height: 6px; background: #F1F5F9; border-radius: 100px; overflow: hidden; }
        .an-progress-fill { height: 100%; border-radius: 100px; transition: width 0.8s ease; opacity: 0.8; }
        .an-progress-pct { font-size: 10px; color: #94a3b8; font-weight: 600; white-space: nowrap; }
      `}</style>
    </div>
  );
}
