import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { normalizeString, resolveCompanyId } from "../../../_shared";
import { saveUploadedFile } from "../../../_upload";

export const runtime = "nodejs";

type RouteContext = { params: { gigId: string } } | { params: Promise<{ gigId: string }> };

async function getGigId(context: RouteContext) {
  const maybePromise = (context as { params: Promise<{ gigId: string }> }).params;
  const params =
    typeof (maybePromise as Promise<{ gigId: string }>)?.then === "function"
      ? await maybePromise
      : (context as { params: { gigId: string } }).params;
  return params?.gigId?.trim() ?? "";
}

async function assertFounderOwnsGig(req: Request, gigId: string) {
  const companyId = await resolveCompanyId(req);
  if (!companyId) return { ok: false as const, status: 404 as const, error: "No startup company found." };
  const gig = await prisma.gigs.findUnique({
    where: { id: gigId },
    select: { company_id: true },
  });
  if (!gig) return { ok: false as const, status: 404 as const, error: "Gig not found." };
  if (gig.company_id !== companyId) {
    return { ok: false as const, status: 403 as const, error: "Not allowed to view applications for this gig." };
  }
  return { ok: true as const };
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const gigId = await getGigId(context);
    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required." }, { status: 400 });
    }

    const gate = await assertFounderOwnsGig(req, gigId);
    if (!gate.ok) {
      return NextResponse.json({ success: false, error: gate.error }, { status: gate.status });
    }

    const applications = await prisma.gig_applications.findMany({
      where: { gig_id: gigId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            skills: true,
            specialization: true,
            rating: true,
            avatar_path: true,
            github_url: true,
            linkedin_url: true,
            bio: true,
            year: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: applications.map((app) => ({
        id: app.id,
        gigId: app.gig_id,
        userId: app.user_id,
        motivation: app.motivation,
        resumeUrl: app.resume_url,
        status: app.status,
        appliedAt: app.created_at,
        applicant: app.users
          ? {
              id: app.users.id,
              name: app.users.name,
              skills: app.users.skills ?? [],
              role: app.users.specialization ?? "",
              rating: app.users.rating?.toString() ?? "",
              avatar: app.users.avatar_path,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("STARTUP_GIG_APPLICATIONS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch applications";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const gigId = await getGigId(context);
    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required." }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization") || undefined;
    const payload = verifyToken(authHeader);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Sign in to apply." }, { status: 401 });
    }

    const gig = await prisma.gigs.findUnique({
      where: { id: gigId },
      select: {
        id: true,
        title: true,
        status: true,
        companies: { select: { owner_id: true, name: true } },
      },
    });
    if (!gig) {
      return NextResponse.json({ success: false, error: "Gig not found." }, { status: 404 });
    }
    if (gig.status !== "OPEN") {
      return NextResponse.json({ success: false, error: "This gig is no longer accepting applications." }, { status: 400 });
    }

    let motivation = "";
    let resumeUrl = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      motivation = normalizeString(form.get("motivation"));
      const file = form.get("resume");
      if (file instanceof File && file.size > 0) {
        resumeUrl = await saveUploadedFile(file, "gig-applications");
      }
    } else {
      const body = (await req.json()) as {
        motivation?: unknown;
        resumeUrl?: unknown;
        userId?: unknown;
      };
      motivation = normalizeString(body.motivation);
      resumeUrl = normalizeString(body.resumeUrl);
      if (normalizeString(body.userId) && normalizeString(body.userId) !== payload.userId) {
        return NextResponse.json({ success: false, error: "Invalid user." }, { status: 403 });
      }
    }

    if (!motivation || motivation.length < 20) {
      return NextResponse.json(
        { success: false, error: "Motivation must be at least 20 characters." },
        { status: 400 }
      );
    }
    if (!resumeUrl) {
      return NextResponse.json(
        { success: false, error: "A portfolio / CV file or resume URL is required." },
        { status: 400 }
      );
    }

    const created = await prisma.gig_applications.create({
      data: {
        gig_id: gigId,
        user_id: payload.userId,
        motivation,
        resume_url: resumeUrl,
      },
    });

    const ownerId = gig.companies?.owner_id;
    if (ownerId && ownerId !== payload.userId) {
      try {
        const applicant = await prisma.users.findUnique({
          where: { id: payload.userId },
          select: { name: true },
        });
        const applicantName = applicant?.name?.trim() || "A student";
        const companyName = gig.companies?.name?.trim() || "Your startup";
        const gigTitle = gig.title?.trim() || "a gig";
        const msg = `${applicantName} applied for "${gigTitle}" (${companyName}). Open Applications to review.`;
        await prisma.app_notifications.create({
          data: {
            id: randomUUID(),
            receiver_id: ownerId,
            sender_id: payload.userId,
            type: "application",
            title: "New job application",
            message: msg.slice(0, 500),
            meta: {
              gigId,
              applicationId: created.id,
              gigTitle,
              companyName,
              applicantName,
            },
          },
        });
      } catch (notifyErr) {
        console.error("NEW_APPLICATION_NOTIFY_ERROR:", notifyErr);
      }
    }

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, error: "You already applied to this gig." }, { status: 409 });
    }
    console.error("STARTUP_GIG_APPLICATIONS_POST_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to create application";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
