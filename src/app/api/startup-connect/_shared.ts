import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { COMPANY_UUID_RE } from "@/lib/companyUuid";

export { COMPANY_UUID_RE } from "@/lib/companyUuid";

/**
 * For review listing: optional ?companyId= must be an existing company when provided;
 * otherwise uses the authenticated founder's company (dashboard). No "latest company" fallback.
 */
export async function resolveCompanyIdForReviews(req: Request, explicitCompanyId?: string | null) {
  const trimmed = typeof explicitCompanyId === "string" ? explicitCompanyId.trim() : "";
  if (trimmed) {
    if (!COMPANY_UUID_RE.test(trimmed)) return null;
    const exists = await prisma.companies.findUnique({
      where: { id: trimmed },
      select: { id: true },
    });
    return exists?.id ?? null;
  }

  const authHeader = req.headers.get("authorization") || undefined;
  const payload = verifyToken(authHeader);

  if (payload?.userId) {
    const owned = await prisma.companies.findFirst({
      where: { owner_id: payload.userId },
      orderBy: { created_at: "desc" },
      select: { id: true },
    });
    if (owned?.id) return owned.id;
  }

  return null;
}

/**
 * Review list for a founder dashboard: company must be owned by `ownerUserId`.
 * Optional `?companyId=` (UUID) or `?companyName=` (registered name, case-insensitive exact);
 * otherwise the newest owned company. Ensures `company_reviews.company_id` lines up with student submissions.
 */
export async function resolveOwnedCompanyForReviews(url: URL, ownerUserId: string): Promise<string | null> {
  const paramCompanyId = normalizeString(url.searchParams.get("companyId"));
  const paramCompanyName = normalizeString(url.searchParams.get("companyName"));
  const hasUuidParam = Boolean(paramCompanyId && COMPANY_UUID_RE.test(paramCompanyId));
  const hasNameParam = paramCompanyName.length >= 2;

  if (hasUuidParam) {
    const row = await prisma.companies.findFirst({
      where: { id: paramCompanyId, owner_id: ownerUserId },
      select: { id: true },
    });
    return row?.id ?? null;
  }

  if (hasNameParam) {
    const row = await prisma.companies.findFirst({
      where: {
        owner_id: ownerUserId,
        name: { equals: paramCompanyName, mode: "insensitive" },
      },
      select: { id: true },
    });
    return row?.id ?? null;
  }

  const row = await prisma.companies.findFirst({
    where: { owner_id: ownerUserId },
    orderBy: { created_at: "desc" },
    select: { id: true },
  });
  return row?.id ?? null;
}

/**
 * Resolves the caller's startup `company_id`.
 * - Never uses a non-UUID string (e.g. student IDs like IT23xxxx from search/localStorage).
 * - Never falls back to "latest company in DB" (prevents students seeing another founder's data).
 * - With JWT: returns owned company, or `fallbackCompanyId` only if it is a UUID and owned by this user.
 * - Without JWT: returns `fallbackCompanyId` only if it is a UUID and exists in `companies` (public reads).
 */
export async function resolveCompanyId(req: Request, fallbackCompanyId?: string) {
  const authHeader = req.headers.get("authorization") || undefined;
  const payload = verifyToken(authHeader);
  const fb = typeof fallbackCompanyId === "string" ? fallbackCompanyId.trim() : "";

  if (payload?.userId) {
    const owned = await prisma.companies.findFirst({
      where: { owner_id: payload.userId },
      orderBy: { created_at: "desc" },
      select: { id: true },
    });
    if (owned?.id) return owned.id;

    if (fb && COMPANY_UUID_RE.test(fb)) {
      const match = await prisma.companies.findFirst({
        where: { id: fb, owner_id: payload.userId },
        select: { id: true },
      });
      if (match?.id) return match.id;
    }

    return null;
  }

  if (fb && COMPANY_UUID_RE.test(fb)) {
    const exists = await prisma.companies.findUnique({
      where: { id: fb },
      select: { id: true },
    });
    if (exists?.id) return exists.id;
  }

  return null;
}

export function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
