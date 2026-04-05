import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export const runtime = "nodejs";

function formatBudget(value: unknown): string {
  if (value == null || value === "") return "Not specified";
  let n: number;
  if (typeof value === "number") {
    n = value;
  } else if (typeof value === "bigint") {
    n = Number(value);
  } else if (typeof value === "string") {
    n = parseFloat(value.replace(/[^0-9.-]/g, ""));
  } else if (typeof value === "object" && value !== null && "toString" in value) {
    n = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  } else {
    return "Not specified";
  }
  if (!Number.isFinite(n) || n <= 0) return "Not specified";
  const rounded = Math.round(n);
  return `LKR ${rounded.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

function deriveLevel(requirementCount: number) {
  if (requirementCount >= 4) return "Advanced";
  if (requirementCount >= 2) return "Intermediate";
  return "Beginner";
}

function formatPostedLabel(createdAt: Date | null | undefined) {
  if (!createdAt) return "Recently posted";
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "Recently posted";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 14) return `Posted ${days} days ago`;
  return `Posted ${d.toLocaleString("en-LK", { month: "short", year: "numeric" })}`;
}

function formatExpectedDeadlineLabel(createdAt: Date | null | undefined) {
  if (!createdAt) return "";
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" });
}

export async function GET() {
  try {
    let rows: any[] = [];

    const gigSelect = {
      id: true,
      title: true,
      description: true,
      requirements: true,
      budget: true,
      status: true,
      created_at: true,
      companies: {
        select: {
          id: true,
          name: true,
          industry: true,
          location: true,
        },
      },
    } as const;

    try {
      rows = await prisma.gigs.findMany({
        where: { status: "OPEN" },
        orderBy: { created_at: "desc" },
        select: gigSelect,
      });
    } catch (gigsErr) {
      console.error("BROWSE_GIGS_FIND_MANY_ERROR:", gigsErr);

      const fallback = await prisma.gigs.findMany({
        where: { status: "OPEN" },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          requirements: true,
          budget: true,
          status: true,
          created_at: true,
          companies: {
            select: {
              id: true,
              name: true,
              industry: true,
              location: true,
            },
          },
        },
      });

      rows = fallback.map((gig) => ({
        ...gig,
        status: gig.status ?? "OPEN",
      }));
    }

    const mapped = rows.map((gig) => {
      const industry = gig.companies?.industry ?? "";
      const category =
        (typeof industry === "string" && industry.split(/[,&]/)[0]?.trim()) || "Opportunity";

      const startupName = gig.companies?.name ?? "Startup";
      const startupId = gig.companies?.id ?? "";

      return {
        id: gig.id,
        title: gig.title,
        startup: startupName,
        startupId,
        category,
        description: gig.description,
        budget: formatBudget(gig.budget),
        type: gig.companies?.location ?? "Remote",
        level: deriveLevel(Array.isArray(gig.requirements) ? gig.requirements.length : 0),
        postedLabel: formatPostedLabel(gig.created_at),
        expectedDeadline: formatExpectedDeadlineLabel(gig.created_at),
        logoUrl: null,
      };
    });

    // Hide accidental duplicates (same startup + same title), keep newest.
    const seen = new Set<string>();
    const data = mapped.filter((gig) => {
      const key = `${gig.startupId}:${gig.title.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("BROWSE_GIGS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load gigs";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
