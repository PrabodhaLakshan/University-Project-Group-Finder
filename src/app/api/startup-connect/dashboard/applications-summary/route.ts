import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { resolveCompanyId } from "../../_shared";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json({ success: true, data: { pending: 0, total: 0 } });
    }

    const gigs = await prisma.gigs.findMany({
      where: { company_id: companyId, NOT: { status: "CLOSED" } },
      select: { id: true },
    });
    const ids = gigs.map((g) => g.id);
    if (ids.length === 0) {
      return NextResponse.json({ success: true, data: { pending: 0, total: 0 } });
    }

    const [pending, total] = await Promise.all([
      prisma.gig_applications.count({
        where: { gig_id: { in: ids }, status: "PENDING" },
      }),
      prisma.gig_applications.count({ where: { gig_id: { in: ids } } }),
    ]);

    return NextResponse.json({ success: true, data: { pending, total } });
  } catch (error) {
    console.error("STARTUP_APPLICATIONS_SUMMARY_ERROR:", error);
    return NextResponse.json({ success: true, data: { pending: 0, total: 0 } });
  }
}
