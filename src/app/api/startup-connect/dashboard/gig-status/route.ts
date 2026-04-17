import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { formatDate, resolveCompanyId } from "../../_shared";
import { countGigCompletionApprovalsByGigIds } from "../../_completion";

export const runtime = "nodejs";

type AppStatus = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";

function normalizeAppStatus(value: string | null | undefined): AppStatus {
  const upper = (value ?? "").trim().toUpperCase();
  if (upper === "REVIEWED" || upper === "ACCEPTED" || upper === "REJECTED") {
    return upper;
  }
  return "PENDING";
}

export async function GET(req: Request) {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const gigs = await prisma.gigs.findMany({
      where: { company_id: companyId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        budget: true,
        created_at: true,
        gig_applications: {
          select: { status: true },
        },
      },
    });

    const completionCounts = await countGigCompletionApprovalsByGigIds(gigs.map((gig) => gig.id));

    const data = gigs.map((gig) => {
      const counts = {
        total: gig.gig_applications.length,
        pending: 0,
        reviewed: completionCounts.get(gig.id) ?? 0,
        accepted: 0,
        rejected: 0,
      };

      for (const app of gig.gig_applications) {
        const status = normalizeAppStatus(app.status);
        if (status === "PENDING") counts.pending += 1;
        if (status === "ACCEPTED") counts.accepted += 1;
        if (status === "REJECTED") counts.rejected += 1;
      }

      return {
        id: gig.id,
        title: gig.title,
        status: gig.status,
        budget: gig.budget?.toString() ?? "",
        postedAt: formatDate(gig.created_at),
        counts,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("STARTUP_GIG_STATUS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load gig status";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
