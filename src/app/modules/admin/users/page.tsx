"use client";

import { useEffect, useState } from "react";
import {
  Search, Users, Eye, ShieldMinus, Trash2,
  RefreshCw, UserCheck, GraduationCap, Mail, Calendar, Filter,
} from "lucide-react";

type DBUser = {
  id: string;
  student_id: string;
  name: string;
  email: string;
  role: string;
  specialization: string | null;
  year: number | null;
  semester: number | null;
  created_at: string | null;
};

const roleStyle: Record<string, { bg: string; text: string; border: string; color: string }> = {
  STUDENT: { bg: "#EEF2FF", text: "#4B6CF7", border: "#C7D2FE", color: "#4B6CF7" },
  TUTOR: { bg: "#F0FDF4", text: "#16a34a", border: "#BBF7D0", color: "#22C55E" },
  ADMIN: { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA", color: "#F97316" },
  DEFAULT: { bg: "#F8FAFF", text: "#64748b", border: "#E2E8F0", color: "#64748b" },
};

const avatarGradients = [
  "linear-gradient(135deg,#4B6CF7,#6C4CF1)",
  "linear-gradient(135deg,#F97316,#FBBF24)",
  "linear-gradient(135deg,#22C55E,#4B6CF7)",
  "linear-gradient(135deg,#6C4CF1,#ec4899)",
  "linear-gradient(135deg,#FBBF24,#F97316)",
];

function formatDate(ds: string | null) {
  if (!ds) return "—";
  try { return new Date(ds).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return "—"; }
}
function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [filtered, setFiltered] = useState<DBUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchUsers() {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setUsers(data.users ?? []);
      setFiltered(data.users ?? []);
    } catch { setError("Could not load user data."); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let r = users;
    if (roleFilter !== "ALL") r = r.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.student_id.toLowerCase().includes(q));
    }
    setFiltered(r);
  }, [search, roleFilter, users]);

  const roles = ["ALL", ...Array.from(new Set(users.map((u) => u.role)))];

  return (
    <div className="au-root">
      <div className="au-header">
        <div>
          <p className="au-eyebrow">👥 User Management</p>
          <h2 className="au-title">Platform Users</h2>
          <p className="au-subtitle">View and manage all registered users. Real-time data from the database.</p>
        </div>
        <div className="au-total-pill">
          <Users size={14} />
          <span>{users.length} total users</span>
        </div>
      </div>

      {/* Controls */}
      <div className="au-controls">
        <div className="au-search-wrap">
          <Search size={14} className="au-search-icon" />
          <input type="text" placeholder="Search by name, email or student ID..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="au-search-input" id="user-search" />
        </div>
        <div className="au-filter-wrap">
          <Filter size={14} className="au-filter-icon" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="au-filter-select" id="role-filter">
            {roles.map((r) => <option key={r} value={r}>{r === "ALL" ? "All Roles" : r}</option>)}
          </select>
        </div>
        <button onClick={fetchUsers} className="au-refresh-btn" title="Refresh">
          <RefreshCw size={14} className={loading ? "au-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="au-error">
          <span>⚠️ {error}</span>
          <button onClick={fetchUsers}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="au-loading">
          <div className="au-spinner" />
          <p>Loading users from database...</p>
        </div>
      ) : (
        <>
          {/* Mini stats */}
          <div className="au-mini-stats">
            {[
              { label: "Total", value: users.length, icon: Users, color: "#4B6CF7", bg: "#EEF2FF" },
              { label: "Students", value: users.filter((u) => u.role === "STUDENT").length, icon: GraduationCap, color: "#6C4CF1", bg: "#F5F3FF" },
              { label: "Tutors", value: users.filter((u) => u.role === "TUTOR").length, icon: UserCheck, color: "#22C55E", bg: "#F0FDF4" },
              { label: "Admins", value: users.filter((u) => u.role === "ADMIN").length, icon: ShieldMinus, color: "#F97316", bg: "#FFF7ED" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="au-mini-stat" style={{ borderColor: `${s.color}25` }}>
                  <div className="au-mini-icon" style={{ background: s.bg, color: s.color }}><Icon size={14} /></div>
                  <div>
                    <p className="au-mini-val" style={{ color: s.color }}>{s.value}</p>
                    <p className="au-mini-lbl">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="au-table-card">
            <div className="au-table-scroll">
              <table className="au-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Student ID</th>
                    <th>Role</th>
                    <th>Specialization</th>
                    <th>Year / Sem</th>
                    <th><Calendar size={11} style={{ display: "inline", marginRight: 3 }} />Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="au-empty">
                      <Users size={32} style={{ opacity: 0.3, margin: "0 auto 0.5rem", display: "block" }} />
                      No users found
                    </td></tr>
                  ) : filtered.map((user, idx) => {
                    const rs = roleStyle[user.role] ?? roleStyle.DEFAULT;
                    return (
                      <tr key={user.id} className="au-row">
                        <td>
                          <div className="au-user-cell">
                            <div className="au-avatar" style={{ background: avatarGradients[idx % avatarGradients.length] }}>
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <p className="au-name">{user.name}</p>
                              <p className="au-email"><Mail size={9} style={{ display: "inline", marginRight: 2 }} />{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="au-sid">{user.student_id}</span></td>
                        <td>
                          <span className="au-role-badge" style={{ background: rs.bg, color: rs.text, border: `1px solid ${rs.border}` }}>
                            {user.role}
                          </span>
                        </td>
                        <td className="au-td">{user.specialization ?? "—"}</td>
                        <td className="au-td">{user.year ? `Y${user.year}` : "—"}{user.semester ? ` / S${user.semester}` : ""}</td>
                        <td className="au-td">{formatDate(user.created_at)}</td>
                        <td>
                          <div className="au-actions">
                            <button className="au-btn au-btn-view"><Eye size={12} /> View</button>
                            <button className="au-btn au-btn-suspend"><ShieldMinus size={12} /></button>
                            <button className="au-btn au-btn-del"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length > 0 && (
              <div className="au-table-footer">Showing {filtered.length} of {users.length} users</div>
            )}
          </div>
        </>
      )}

      <style>{`
        .au-root { display: flex; flex-direction: column; gap: 1.25rem; }
        .au-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .au-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4B6CF7; margin: 0 0 0.25rem; }
        .au-title { font-size: 1.65rem; font-weight: 900; color: #0f172a; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .au-subtitle { color: #64748b; font-size: 0.83rem; margin: 0; }
        .au-total-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0.5rem 1rem; border-radius: 11px;
          background: #EEF2FF; border: 1px solid #C7D2FE;
          color: #4B6CF7; font-size: 0.82rem; font-weight: 700; white-space: nowrap;
        }
        .au-controls { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
        .au-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .au-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .au-search-input {
          width: 100%; height: 40px; padding: 0 1rem 0 34px;
          background: white; border: 1.5px solid #E2E8F0; border-radius: 11px;
          color: #1e293b; font-size: 0.83rem; outline: none; transition: all 0.2s;
        }
        .au-search-input::placeholder { color: #cbd5e1; }
        .au-search-input:focus { border-color: #4B6CF7; box-shadow: 0 0 0 3px rgba(75,108,247,0.1); }
        .au-filter-wrap { position: relative; }
        .au-filter-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .au-filter-select {
          height: 40px; padding: 0 1rem 0 32px;
          background: white; border: 1.5px solid #E2E8F0; border-radius: 11px;
          color: #1e293b; font-size: 0.83rem; outline: none; cursor: pointer; min-width: 125px;
        }
        .au-refresh-btn {
          display: flex; align-items: center; gap: 5px; height: 40px; padding: 0 0.875rem;
          background: white; border: 1.5px solid #E2E8F0; border-radius: 11px;
          color: #64748b; font-size: 0.82rem; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: all 0.2s;
        }
        .au-refresh-btn:hover { background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7; }
        .au-spin { animation: auSpin 0.8s linear infinite; }
        @keyframes auSpin { to { transform: rotate(360deg); } }
        .au-error {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.75rem 1rem; border-radius: 11px;
          background: #FFF5F5; border: 1px solid #FECACA; color: #DC2626; font-size: 0.83rem;
        }
        .au-error button { padding: 0.25rem 0.625rem; border-radius: 7px; font-size: 0.78rem; font-weight: 600; background: #FEE2E2; border: 1px solid #FCA5A5; color: #DC2626; cursor: pointer; }
        .au-loading { display: flex; flex-direction: column; align-items: center; gap: 0.875rem; padding: 3rem; }
        .au-spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid #E2E8F0; border-top-color: #4B6CF7; animation: auSpin 0.8s linear infinite; }
        .au-loading p { color: #64748b; font-size: 0.85rem; }
        .au-mini-stats { display: flex; gap: 0.625rem; flex-wrap: wrap; }
        .au-mini-stat {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.625rem 0.875rem; background: white;
          border: 1.5px solid; border-radius: 12px; flex: 1; min-width: 105px;
          box-shadow: 0 1px 6px rgba(15,23,42,0.05);
        }
        .au-mini-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .au-mini-val { font-size: 1.05rem; font-weight: 800; margin: 0; }
        .au-mini-lbl { font-size: 10px; color: #64748b; font-weight: 600; margin: 0; }
        .au-table-card { background: white; border: 1px solid #E2E8F0; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 8px rgba(15,23,42,0.06); }
        .au-table-scroll { overflow-x: auto; }
        .au-table { width: 100%; border-collapse: collapse; text-align: left; }
        .au-table thead tr { background: #F8FAFF; border-bottom: 1px solid #E2E8F0; }
        .au-table th { padding: 0.75rem 1.25rem; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; white-space: nowrap; }
        .au-row { border-bottom: 1px solid #F1F5F9; transition: background 0.15s; }
        .au-row:hover { background: #F8FAFF; }
        .au-row:last-child { border-bottom: none; }
        .au-row td { padding: 0.875rem 1.25rem; vertical-align: middle; }
        .au-user-cell { display: flex; align-items: center; gap: 0.75rem; }
        .au-avatar { width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: white; }
        .au-name { font-size: 0.83rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; white-space: nowrap; }
        .au-email { font-size: 10px; color: #94a3b8; margin: 0; display: flex; align-items: center; }
        .au-sid { font-size: 11px; font-weight: 600; color: #94a3b8; font-family: monospace; }
        .au-role-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10.5px; font-weight: 700; white-space: nowrap; }
        .au-td { font-size: 0.8rem; color: #64748b; }
        .au-actions { display: flex; align-items: center; gap: 0.375rem; }
        .au-btn { display: flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 9px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1.5px solid; transition: all 0.18s; white-space: nowrap; }
        .au-btn-view { background: #EEF2FF; border-color: #C7D2FE; color: #4B6CF7; }
        .au-btn-view:hover { background: #E0E7FF; }
        .au-btn-suspend { background: #FFF7ED; border-color: #FED7AA; color: #F97316; }
        .au-btn-suspend:hover { background: #FFEDD5; }
        .au-btn-del { background: #FFF5F5; border-color: #FECACA; color: #EF4444; }
        .au-btn-del:hover { background: #FEE2E2; }
        .au-empty { padding: 3rem; text-align: center; color: #94a3b8; font-size: 0.875rem; }
        .au-table-footer { padding: 0.75rem 1.25rem; border-top: 1px solid #F1F5F9; font-size: 11px; color: #94a3b8; font-weight: 600; }
      `}</style>
    </div>
  );
}
