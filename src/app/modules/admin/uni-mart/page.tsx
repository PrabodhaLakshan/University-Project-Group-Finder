import Link from "next/link";
import { ShoppingBag, Flag, CheckCircle2, AlertTriangle, Eye, EyeOff, Trash2, ArrowUpRight } from "lucide-react";
import { marketplacePosts } from "../utils/mock-data";

const statusStyle: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: "#F0FDF4", text: "#16a34a", border: "#BBF7D0" },
  Pending: { bg: "#FFFBEB", text: "#d97706", border: "#FDE68A" },
  Approved: { bg: "#EEF2FF", text: "#4B6CF7", border: "#C7D2FE" },
  Reported: { bg: "#FFF5F5", text: "#DC2626", border: "#FECACA" },
  Suspended: { bg: "#F8FAFF", text: "#64748b", border: "#E2E8F0" },
};

export default function AdminUniMartPage() {
  return (
    <div className="um-root">
      <div className="um-header">
        <div>
          <p className="um-eyebrow">🛒 Module Control</p>
          <h2 className="um-title">Uni Mart</h2>
          <p className="um-subtitle">Moderate marketplace listings, resolve disputes, and review flagged items.</p>
        </div>
        <Link href="/uni-mart" className="um-visit-btn">
          Visit Module <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="um-stats">
        {[
          { label: "Active Listings", value: "642", icon: ShoppingBag, color: "#F97316", bg: "#FFF7ED" },
          { label: "Reported Posts", value: "7", icon: Flag, color: "#DC2626", bg: "#FFF5F5" },
          { label: "Pending Review", value: "23", icon: AlertTriangle, color: "#d97706", bg: "#FFFBEB" },
          { label: "Approved Today", value: "41", icon: CheckCircle2, color: "#16a34a", bg: "#F0FDF4" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="um-stat" style={{ borderColor: `${s.color}25` }}>
              <div className="um-stat-icon" style={{ background: s.bg, color: s.color }}><Icon size={17} /></div>
              <div>
                <p className="um-stat-val" style={{ color: s.color }}>{s.value}</p>
                <p className="um-stat-lbl">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="um-table-wrap">
        <div className="um-scroll">
          <table className="um-table">
            <thead><tr>
              <th>Item</th><th>Seller</th><th>Category</th><th>Price</th><th>Reports</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {marketplacePosts.map((p) => {
                const s = statusStyle[p.status] ?? statusStyle.Pending;
                return (
                  <tr key={p.id} className="um-row">
                    <td><p className="um-item">{p.itemTitle}</p></td>
                    <td className="um-td">{p.seller}</td>
                    <td><span className="um-cat">{p.category}</span></td>
                    <td><span className="um-price">{p.price}</span></td>
                    <td><span className="um-reports" style={{ color: p.reports > 0 ? "#DC2626" : "#94a3b8" }}>
                      {p.reports > 0 ? `⚠ ${p.reports}` : "0"}
                    </span></td>
                    <td><span className="um-badge" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{p.status}</span></td>
                    <td>
                      <div className="um-actions">
                        <button className="um-btn um-btn-view"><Eye size={11} /> View</button>
                        <button className="um-btn um-btn-hide"><EyeOff size={11} /></button>
                        <button className="um-btn um-btn-del"><Trash2 size={11} /></button>
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
        .um-root { display: flex; flex-direction: column; gap: 1.25rem; }
        .um-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .um-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #F97316; margin: 0 0 0.25rem; }
        .um-title { font-size: 1.65rem; font-weight: 900; color: #0f172a; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .um-subtitle { color: #64748b; font-size: 0.83rem; margin: 0; }
        .um-visit-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 0.55rem 1rem;
          border-radius: 11px; background: #FFF7ED; border: 1.5px solid #FED7AA;
          color: #F97316; font-size: 0.8rem; font-weight: 700; text-decoration: none; transition: all 0.2s;
        }
        .um-visit-btn:hover { background: #FFEDD5; }
        .um-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
        .um-stat { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: white; border: 1.5px solid; border-radius: 14px; box-shadow: 0 1px 6px rgba(15,23,42,0.05); }
        .um-stat-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .um-stat-val { font-size: 1.35rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
        .um-stat-lbl { font-size: 10.5px; color: #64748b; font-weight: 600; margin: 0; }
        .um-table-wrap { background: white; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 8px rgba(15,23,42,0.06); }
        .um-scroll { overflow-x: auto; }
        .um-table { width: 100%; border-collapse: collapse; text-align: left; }
        .um-table thead tr { background: #F8FAFF; border-bottom: 1px solid #E2E8F0; }
        .um-table th { padding: 0.75rem 1.25rem; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; }
        .um-row { border-bottom: 1px solid #F1F5F9; transition: background 0.15s; }
        .um-row:hover { background: #FFFBF5; }
        .um-row:last-child { border-bottom: none; }
        .um-row td { padding: 0.875rem 1.25rem; vertical-align: middle; }
        .um-item { font-size: 0.83rem; font-weight: 700; color: #0f172a; margin: 0; }
        .um-td { font-size: 0.8rem; color: #64748b; }
        .um-cat { display: inline-block; padding: 3px 10px; border-radius: 100px; background: #FFF7ED; border: 1px solid #FED7AA; color: #F97316; font-size: 10.5px; font-weight: 600; }
        .um-price { font-size: 0.8rem; font-weight: 700; color: #16a34a; }
        .um-reports { font-size: 11px; font-weight: 700; }
        .um-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10.5px; font-weight: 700; }
        .um-actions { display: flex; align-items: center; gap: 0.375rem; }
        .um-btn { display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 9px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.18s; }
        .um-btn-view { background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7; }
        .um-btn-hide { background: #FFF7ED; border-color: #FED7AA; color: #F97316; }
        .um-btn-del { background: #FFF5F5; border-color: #FECACA; color: #EF4444; }
      `}</style>
    </div>
  );
}
