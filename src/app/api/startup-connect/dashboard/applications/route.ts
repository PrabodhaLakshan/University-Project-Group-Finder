import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { formatDate, resolveCompanyId } from "../../_shared";

export const runtime = "nodejs";

function humanizeStatus(status: string) {
  const u = status.trim().toUpperCase();
  if (u === "PENDING") return "Pending";
  if (u === "REVIEWED") return "Reviewed";
  if (u === "ACCEPTED") return "Accepted";
  if (u === "REJECTED") return "Rejected";
  return status;
}

export async function GET(req: Request) {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json({ success: true, data: [] });
    }

    let gigs: any[] = [];
    try {
      gigs = await prisma.gigs.findMany({
        where: { company_id: companyId },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          budget: true,
          created_at: true,
          gig_applications: {
            select: {
              id: true,
              motivation: true,
              resume_url: true,
              status: true,
              created_at: true,
              users: {
                select: {
                  id: true,
                  name: true,
                  skills: true,
                  bio: true,
                  specialization: true,
                  rating: true,
                  github_url: true,
                  linkedin_url: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      console.error("STARTUP_DASHBOARD_APPLICATIONS_QUERY_ERROR:", err);

      // Fallback for older databases that might be missing newer columns
      const fallback = await prisma.gigs.findMany({
        where: { company_id: companyId },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          created_at: true,
          gig_applications: {
            select: {
              id: true,
              status: true,
              created_at: true,
              users: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      gigs = fallback.map((gig) => ({
        ...gig,
        budget: null,
        gig_applications: gig.gig_applications.map((app: any) => ({
          ...app,
          motivation: "",
          resume_url: "",
          users: {
            skills: [],
            bio: "",
            specialization: "",
            rating: null,
            github_url: "",
            linkedin_url: "",
            ...(app.users ?? {}),
          },
        })),
      }));
    }

    const data = gigs.map((gig) => ({
      id: gig.id,
      title: gig.title,
      budget: gig.budget != null ? gig.budget.toString() : "",
      timeline: formatDate(gig.created_at),
      applicants: gig.gig_applications.map((app) => {
        const u = app.users;
        const name = u?.name?.trim() || "Applicant";
        const initial = name.charAt(0).toUpperCase() || "?";
        const ratingNum =
          u?.rating != null && u.rating !== undefined ? Number(u.rating.toString()) : null;

        return {
          id: app.id,
          name,
          date: formatDate(app.created_at),
          status: humanizeStatus(app.status),
          rawStatus: app.status,
          image: initial,
          skills: u?.skills ?? [],
          experience: (u?.bio || u?.specialization || "—").trim() || "—",
          rating: Number.isFinite(ratingNum) ? ratingNum : null,
          portfolio: app.resume_url?.trim() ? app.resume_url.trim() : "",
          motivation: app.motivation ?? "",
          githubUrl: u?.github_url?.trim() ?? "",
          linkedinUrl: u?.linkedin_url?.trim() ?? "",
          userId: u?.id ?? "",
        };
      }),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("STARTUP_DASHBOARD_APPLICATIONS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load applications";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
