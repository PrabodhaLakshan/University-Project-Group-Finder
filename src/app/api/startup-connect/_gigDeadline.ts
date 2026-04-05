/** Parse HTML date (YYYY-MM-DD) or ISO string for storage. */
export function parseDeadlineAt(raw: string | null | undefined): Date | null {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(`${s}T23:59:59.999Z`);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** API / form: YYYY-MM-DD */
export function formatDeadlineForApi(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}
