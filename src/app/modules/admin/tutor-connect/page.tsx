import Link from "next/link";
import { UserRoundSearch, BookOpenCheck, Clock, Star, Eye, ShieldMinus, ArrowUpRight } from "lucide-react";
import { tutors } from "../utils/mock-data";

const statusStyle: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: "#F0FDF4", text: "#16a34a", border: "#BBF7D0" },
  Pending: { bg: "#FFFBEB", text: "#d97706", border: "#FDE68A" },
  Approved: { bg: "#EEF2FF", text: "#4B6CF7", border: "#C7D2FE" },
  Suspended: { bg: "#FFF5F5", text: "#DC2626", border: "#FECACA" },
};

export default function AdminTutorConnectPage() {
  return (
    <div className="tc-root">
      <div className="tc-header">
        <div>
          <p className="tc-eyebrow">📚 Module Control</p>
          <h2 className="tc-title">Tutor Finder</h2>
          <p className="tc-subtitle">Oversee tutor slots, review feedback, and manage booking requests across the platform.</p>
        </div>
        <Link href="/modules/tutor-connect" className="tc-visit-btn">
          Visit Module <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="tc-stats">
        {[
          { label: "Active Tutors", value: "94", icon: UserRoundSearch, color: "#22C55E", bg: "#F0FDF4" },
          { label: "Total Bookings", value: "1,286", icon: BookOpenCheck, color: "#4B6CF7", bg: "#EEF2FF" },
          { label: "Waitlist Requests", value: "74", icon: Clock, color: "#F97316", bg: "#FFF7ED" },
          { label: "Avg Rating", value: "4.8", icon: Star, color: "#d97706", bg: "#FFFBEB" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="tc-stat" style={{ borderColor: `${s.color}25` }}>
              <div className="tc-stat-icon" style={{ background: s.bg, color: s.color }}><Icon size={17} /></div>
              <div>
                <p className="tc-stat-val" style={{ color: s.color }}>{s.value}</p>
                <p className="tc-stat-lbl">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tc-table-wrap">
        <div className="tc-scroll">
          <table className="tc-table">
            <thead><tr>
              <th>Tutor</th><th>Subject</th><th>Rating</th><th>Bookings</th><th>Waitlist</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {tutors.map((t) => {
                const s = statusStyle[t.status] ?? statusStyle.Pending;
                return (
                  <tr key={t.id} className="tc-row">
                    <td><p className="tc-name">{t.name}</p></td>
                    <td><span className="tc-subject">{t.subject}</span></td>
                    <td><span className="tc-rating">⭐ {t.rating}</span></td>
                    <td className="tc-td">{t.bookings}</td>
                    <td className="tc-td">{t.waitlist}</td>
                    <td><span className="tc-badge" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{t.status}</span></td>
                    <td>
                      <div className="tc-actions">
                        <button className="tc-btn tc-btn-view"><Eye size={11} /> View</button>
                        <button className="tc-btn tc-btn-warn"><ShieldMinus size={11} /></button>
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
        .tc-root { display: flex; flex-direction: column; gap: 1.25rem; }
        .tc-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .tc-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #22C55E; margin: 0 0 0.25rem; }
        .tc-title { font-size: 1.65rem; font-weight: 900; color: #0f172a; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .tc-subtitle { color: #64748b; font-size: 0.83rem; margin: 0; }
        .tc-visit-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 0.55rem 1rem;
          border-radius: 11px; background: #F0FDF4; border: 1.5px solid #BBF7D0;
          color: #16a34a; font-size: 0.8rem; font-weight: 700; text-decoration: none; transition: all 0.2s;
        }
        .tc-visit-btn:hover { background: #DCFCE7; }
        .tc-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
        .tc-stat { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: white; border: 1.5px solid; border-radius: 14px; box-shadow: 0 1px 6px rgba(15,23,42,0.05); }
        .tc-stat-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tc-stat-val { font-size: 1.35rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .tc-stat-lbl { font-size: 10.5px; color: #64748b; font-weight: 600; margin: 0; }
        .tc-table-wrap { background: white; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 8px rgba(15,23,42,0.06); }
        .tc-scroll { overflow-x: auto; }
        .tc-table { width: 100%; border-collapse: collapse; text-align: left; }
        .tc-table thead tr { background: #F8FAFF; border-bottom: 1px solid #E2E8F0; }
        .tc-table th { padding: 0.75rem 1.25rem; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; }
        .tc-row { border-bottom: 1px solid #F1F5F9; transition: background 0.15s; }
        .tc-row:hover { background: #F6FEF9; }
        .tc-row:last-child { border-bottom: none; }
        .tc-row td { padding: 0.875rem 1.25rem; vertical-align: middle; }
        .tc-name { font-size: 0.83rem; font-weight: 700; color: #0f172a; margin: 0; }
        .tc-subject { display: inline-block; padding: 3px 10px; border-radius: 100px; background: #F0FDF4; border: 1px solid #BBF7D0; color: #16a34a; font-size: 10.5px; font-weight: 600; }
        .tc-rating { font-size: 0.8rem; font-weight: 700; color: #d97706; }
        .tc-td { font-size: 0.8rem; color: #64748b; }
        .tc-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10.5px; font-weight: 700; }
        .tc-actions { display: flex; align-items: center; gap: 0.375rem; }
        .tc-btn { display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 9px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.18s; }
        .tc-btn-view { background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7; }
        .tc-btn-warn { background: #FFF7ED; border-color: #FED7AA; color: #F97316; }
      `}</style>
    </div>
  );
}
