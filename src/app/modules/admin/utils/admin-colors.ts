export const adminColors = {
  primaryBlue: "#4A90E2",
  deepBlue: "#3B5BDB",
  purpleAccent: "#6C4CF1",
  orangeAccent: "#F59E0B",
  goldAccent: "#F97316",
  textDark: "#111827",
  textSoft: "#6B7280",
  border: "#E5E7EB",
  background: "#F8FAFC",
  cardBackground: "#FFFFFF",
} as const;

export const statusClassMap = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Suspended: "border-rose-200 bg-rose-50 text-rose-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  Reported: "border-orange-200 bg-orange-50 text-orange-700",
  Approved: "border-sky-200 bg-sky-50 text-sky-700",
  Rejected: "border-slate-200 bg-slate-100 text-slate-700",
} as const;
