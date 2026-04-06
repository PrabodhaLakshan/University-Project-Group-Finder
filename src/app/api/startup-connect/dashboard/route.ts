import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { formatDate, resolveCompanyId } from "../_shared";

export const runtime = "nodejs";

/**
 * Aggregates founder dashboard: company profile, gigs, recent works.
 * Uses JWT → owned company (`owner_id`) so data saved at registration appears here.
 */
export async function GET(req: Request) {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json({
        success: true,
        data: {
          profile: null,
          gigs: [],
          recentWorks: [],
        },
      });
    }

    let company: {
      id: string;
      name: string;
      industry: string;
      about: string;
    } | null = null;

    try {
      company = await prisma.companies.findUnique({
        where: { id: companyId },
        select: {
          id: true,
          name: true,
          industry: true,
          about: true,
        },
      });
    } catch (companyErr) {
      console.error("STARTUP_DASHBOARD_COMPANY_ERROR:", companyErr);
      return NextResponse.json({
        success: true,
        data: {
          profile: null,
          gigs: [],
          recentWorks: [],
        },
      });
    }

    if (!company) {
      return NextResponse.json({
        success: true,
        data: {
          profile: null,
          gigs: [],
          recentWorks: [],
        },
      });
    }

    let logoUrl: string | null = null;
    let certificateUrls: string[] = [];
    try {
      const media = await prisma.companies.findUnique({
        where: { id: companyId },
        select: { logo_url: true, certificate_url: true },
      });
      logoUrl = media?.logo_url ?? null;
      certificateUrls = media?.certificate_url ? [media.certificate_url] : [];
    } catch {
      /* optional columns */
    }

    let gigs: Array<{
      id: string;
      title: string;
      description: string;
      budget: { toString: () => string } | null;
      created_at: Date | null;
      requirements: string[] | null;
      status: string;
    }> = [];

    try {
      gigs = await prisma.gigs.findMany({
        where: { company_id: companyId, NOT: { status: "CLOSED" } },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          budget: true,
          created_at: true,
          requirements: true,
          status: true,
        },
      });
    } catch (gigsErr) {
      console.error("STARTUP_DASHBOARD_GIGS_ERROR:", gigsErr);
      try {
        const rows = await prisma.gigs.findMany({
          where: { company_id: companyId, NOT: { status: "CLOSED" } },
          select: {
            id: true,
            title: true,
            description: true,
            created_at: true,
            status: true,
          },
        });
        gigs = rows.map((x) => ({
          ...x,
          budget: null,
          requirements: [],
        }));
      } catch {
        gigs = [];
      }
    }

    let recentWorks: Array<{
      id: string;
      title: string;
      description: string;
      project_url: string | null;
      image_url: string | null;
      created_at: Date | null;
    }> = [];

    try {
      recentWorks = await prisma.company_recent_works.findMany({
        where: { company_id: companyId },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          project_url: true,
          image_url: true,
          created_at: true,
        },
      });
    } catch (worksErr) {
      console.error("STARTUP_DASHBOARD_WORKS_ERROR:", worksErr);
      try {
        const rows = await prisma.company_recent_works.findMany({
          where: { company_id: companyId },
          select: {
            id: true,
            title: true,
            description: true,
            created_at: true,
          },
        });
        recentWorks = rows.map((x) => ({
          ...x,
          project_url: null,
          image_url: null,
        }));
      } catch {
        recentWorks = [];
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          about: company.about,
          logoUrl,
          certificateUrls,
        },
        gigs: gigs.map((gig) => ({
          id: gig.id,
          title: gig.title,
          budget: gig.budget?.toString?.() ?? "",
          deadline: formatDate(gig.created_at),
          description: gig.description,
          skills: gig.requirements ?? [],
          status: gig.status,
        })),
        recentWorks: recentWorks.map((work) => ({
          id: work.id,
          title: work.title,
          description: work.description,
          github: "",
          demo: work.project_url ?? "",
          date: formatDate(work.created_at),
          images: work.image_url ? [work.image_url] : [],
        })),
      },
    });
  } catch (error) {
    console.error("STARTUP_DASHBOARD_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load dashboard";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
