import Link from "next/link";
import { UsersRound, FolderKanban, AlertTriangle, CheckCircle2, ArrowUpRight, Eye, ShieldMinus, Trash2 } from "lucide-react";
import { groups } from "../utils/mock-data";

const statusStyle: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: "#F0FDF4", text: "#16a34a", border: "#BBF7D0" },
  Pending: { bg: "#FFFBEB", text: "#d97706", border: "#FDE68A" },
  Approved: { bg: "#EEF2FF", text: "#4B6CF7", border: "#C7D2FE" },
  Reported: { bg: "#FFF5F5", text: "#DC2626", border: "#FECACA" },
};

export default function AdminProjectGroupFinderPage() {
  return (
    <div className="apg-root">
      <div className="apg-header">
        <div>
          <p className="apg-eyebrow">🎓 Module Control</p>
          <h2 className="apg-title">Project Group Finder</h2>
          <p className="apg-subtitle">Manage academic teams, monitor group health, and oversee collaboration requests.</p>
        </div>
        <Link href="/project-group-finder" className="apg-visit-btn">
          Visit Module <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="apg-stats">
        {[
          { label: "Active Groups", value: "214", icon: UsersRound, color: "#4B6CF7", bg: "#EEF2FF" },
          { label: "Pending Matches", value: "49", icon: FolderKanban, color: "#d97706", bg: "#FFFBEB" },
          { label: "Reported Groups", value: "6", icon: AlertTriangle, color: "#DC2626", bg: "#FFF5F5" },
          { label: "Approved Teams", value: "187", icon: CheckCircle2, color: "#16a34a", bg: "#F0FDF4" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="apg-stat" style={{ borderColor: `${s.color}25` }}>
              <div className="apg-stat-icon" style={{ background: s.bg, color: s.color }}><Icon size={17} /></div>
              <div>
                <p className="apg-stat-val" style={{ color: s.color }}>{s.value}</p>
                <p className="apg-stat-lbl">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="apg-table-wrap">
        <div className="apg-scroll">
          <table className="apg-table">
            <thead><tr>
              <th>Project Topic</th><th>Leader</th><th>Members</th><th>Stage</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {groups.map((g) => {
                const s = statusStyle[g.status] ?? statusStyle.Pending;
                return (
                  <tr key={g.id} className="apg-row">
                    <td>
                      <p className="apg-topic">{g.topic}</p>
                      <p className="apg-stage-sub">{g.stage}</p>
                    </td>
                    <td className="apg-td">{g.leader}</td>
                    <td className="apg-td">{g.memberCount}</td>
                    <td><span className="apg-stage-tag">{g.stage}</span></td>
                    <td><span className="apg-badge" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{g.status}</span></td>
                    <td>
                      <div className="apg-actions">
                        <button className="apg-btn apg-btn-view"><Eye size={11} /> View</button>
                        <button className="apg-btn apg-btn-suspend"><ShieldMinus size={11} /></button>
                        <button className="apg-btn apg-btn-del"><Trash2 size={11} /></button>
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
        .apg-root { display: flex; flex-direction: column; gap: 1.25rem; }
        .apg-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .apg-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4B6CF7; margin: 0 0 0.25rem; }
        .apg-title { font-size: 1.65rem; font-weight: 900; color: #0f172a; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .apg-subtitle { color: #64748b; font-size: 0.83rem; margin: 0; }
        .apg-visit-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 0.55rem 1rem;
          border-radius: 11px; background: #EEF2FF; border: 1.5px solid #C7D2FE;
          color: #4B6CF7; font-size: 0.8rem; font-weight: 700; text-decoration: none; transition: all 0.2s; white-space: nowrap;
        }
        .apg-visit-btn:hover { background: #E0E7FF; }
        .apg-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
        .apg-stat { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: white; border: 1.5px solid; border-radius: 14px; box-shadow: 0 1px 6px rgba(15,23,42,0.05); }
        .apg-stat-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .apg-stat-val { font-size: 1.35rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .apg-stat-lbl { font-size: 10.5px; color: #64748b; font-weight: 600; margin: 0; }
        .apg-table-wrap { background: white; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 8px rgba(15,23,42,0.06); }
        .apg-scroll { overflow-x: auto; }
        .apg-table { width: 100%; border-collapse: collapse; text-align: left; }
        .apg-table thead tr { background: #F8FAFF; border-bottom: 1px solid #E2E8F0; }
        .apg-table th { padding: 0.75rem 1.25rem; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; }
        .apg-row { border-bottom: 1px solid #F1F5F9; transition: background 0.15s; }
        .apg-row:hover { background: #F8FAFF; }
        .apg-row:last-child { border-bottom: none; }
        .apg-row td { padding: 0.875rem 1.25rem; vertical-align: middle; }
        .apg-topic { font-size: 0.83rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
        .apg-stage-sub { font-size: 10.5px; color: #94a3b8; margin: 0; }
        .apg-td { font-size: 0.8rem; color: #64748b; }
        .apg-stage-tag { display: inline-block; padding: 3px 10px; border-radius: 100px; background: #F4F6FB; border: 1px solid #E2E8F0; color: #64748b; font-size: 10.5px; font-weight: 600; }
        .apg-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10.5px; font-weight: 700; }
        .apg-actions { display: flex; align-items: center; gap: 0.375rem; }
        .apg-btn { display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 9px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.18s; }
        .apg-btn-view { background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7; }
        .apg-btn-view:hover { background: #E0E7FF; }
        .apg-btn-suspend { background: #FFF7ED; border-color: #FED7AA; color: #F97316; }
        .apg-btn-del { background: #FFF5F5; border-color: #FECACA; color: #EF4444; }
      `}</style>
    </div>
  );
}
