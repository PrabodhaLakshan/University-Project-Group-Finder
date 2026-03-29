import Link from "next/link";
import { Sparkles, CheckCircle2, Building2, Flag, Eye, ShieldMinus, ArrowUpRight } from "lucide-react";
import { startupProfiles } from "../utils/mock-data";

const statusStyle: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: "#F0FDF4", text: "#16a34a", border: "#BBF7D0" },
  Pending: { bg: "#FFFBEB", text: "#d97706", border: "#FDE68A" },
  Approved: { bg: "#F5F3FF", text: "#6C4CF1", border: "#DDD6FE" },
  Reported: { bg: "#FFF5F5", text: "#DC2626", border: "#FECACA" },
  Rejected: { bg: "#F8FAFF", text: "#64748b", border: "#E2E8F0" },
};

export default function AdminStartupFinderPage() {
  return (
    <div className="sf-root">
      <div className="sf-header">
        <div>
          <p className="sf-eyebrow">🚀 Module Control</p>
          <h2 className="sf-title">Startup Connector</h2>
          <p className="sf-subtitle">Verify startup profiles, review gig posts, and manage founder applications.</p>
        </div>
        <Link href="/modules/startup-connect" className="sf-visit-btn">
          Visit Module <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="sf-stats">
        {[
          { label: "Total Startups", value: "138", icon: Sparkles, color: "#6C4CF1", bg: "#F5F3FF" },
          { label: "Verified Founders", value: "82", icon: CheckCircle2, color: "#16a34a", bg: "#F0FDF4" },
          { label: "Open Gigs", value: "39", icon: Building2, color: "#4B6CF7", bg: "#EEF2FF" },
          { label: "Flagged Profiles", value: "5", icon: Flag, color: "#DC2626", bg: "#FFF5F5" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="sf-stat" style={{ borderColor: `${s.color}25` }}>
              <div className="sf-stat-icon" style={{ background: s.bg, color: s.color }}><Icon size={17} /></div>
              <div>
                <p className="sf-stat-val" style={{ color: s.color }}>{s.value}</p>
                <p className="sf-stat-lbl">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sf-table-wrap">
        <div className="sf-scroll">
          <table className="sf-table">
            <thead><tr>
              <th>Startup</th><th>Domain</th><th>Open Gigs</th><th>Verification</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {startupProfiles.map((s) => {
                const vs = statusStyle[s.verificationStatus] ?? statusStyle.Pending;
                const ss = statusStyle[s.status] ?? statusStyle.Pending;
                return (
                  <tr key={s.id} className="sf-row">
                    <td>
                      <p className="sf-name">{s.name}</p>
                      <p className="sf-founder">Founder: {s.founder}</p>
                    </td>
                    <td><span className="sf-domain">{s.domain}</span></td>
                    <td className="sf-td">{s.gigs}</td>
                    <td><span className="sf-badge" style={{ background: vs.bg, color: vs.text, border: `1px solid ${vs.border}` }}>{s.verificationStatus}</span></td>
                    <td><span className="sf-badge" style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}>{s.status}</span></td>
                    <td>
                      <div className="sf-actions">
                        <button className="sf-btn sf-btn-view"><Eye size={11} /> View</button>
                        <button className="sf-btn sf-btn-warn"><ShieldMinus size={11} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .sf-root { display: flex; flex-direction: column; gap: 1.25rem; }
        .sf-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .sf-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #6C4CF1; margin: 0 0 0.25rem; }
        .sf-title { font-size: 1.65rem; font-weight: 900; color: #0f172a; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .sf-subtitle { color: #64748b; font-size: 0.83rem; margin: 0; }
        .sf-visit-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 0.55rem 1rem;
          border-radius: 11px; background: #F5F3FF; border: 1.5px solid #DDD6FE;
          color: #6C4CF1; font-size: 0.8rem; font-weight: 700; text-decoration: none; transition: all 0.2s;
        }
        .sf-visit-btn:hover { background: #EDE9FE; }
        .sf-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
        .sf-stat { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: white; border: 1.5px solid; border-radius: 14px; box-shadow: 0 1px 6px rgba(15,23,42,0.05); }
        .sf-stat-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sf-stat-val { font-size: 1.35rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .sf-stat-lbl { font-size: 10.5px; color: #64748b; font-weight: 600; margin: 0; }
        .sf-table-wrap { background: white; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 8px rgba(15,23,42,0.06); }
        .sf-scroll { overflow-x: auto; }
        .sf-table { width: 100%; border-collapse: collapse; text-align: left; }
        .sf-table thead tr { background: #F8FAFF; border-bottom: 1px solid #E2E8F0; }
        .sf-table th { padding: 0.75rem 1.25rem; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; }
        .sf-row { border-bottom: 1px solid #F1F5F9; transition: background 0.15s; }
        .sf-row:hover { background: #FAF8FF; }
        .sf-row:last-child { border-bottom: none; }
        .sf-row td { padding: 0.875rem 1.25rem; vertical-align: middle; }
        .sf-name { font-size: 0.83rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
        .sf-founder { font-size: 10.5px; color: #94a3b8; margin: 0; }
        .sf-domain { display: inline-block; padding: 3px 10px; border-radius: 100px; background: #F5F3FF; border: 1px solid #DDD6FE; color: #6C4CF1; font-size: 10.5px; font-weight: 600; }
        .sf-td { font-size: 0.8rem; color: #64748b; }
        .sf-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10.5px; font-weight: 700; }
        .sf-actions { display: flex; align-items: center; gap: 0.375rem; }
        .sf-btn { display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 9px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.18s; }
        .sf-btn-view { background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7; }
        .sf-btn-warn { background: #FFF7ED; border-color: #FED7AA; color: #F97316; }
      `}</style>
    </div>
  );
}
