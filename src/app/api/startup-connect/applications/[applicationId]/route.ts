import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { normalizeString, resolveCompanyId } from "../../_shared";
import { recordStartupCollaboration } from "../../_collaborations";

export const runtime = "nodejs";

type RouteContext =
  | { params: Promise<{ applicationId: string }> }
  | { params: { applicationId: string } };

async function getApplicationId(context: RouteContext) {
  const maybePromise = (context as { params: Promise<{ applicationId: string }> }).params;
  const params =
    typeof (maybePromise as Promise<{ applicationId: string }>)?.then === "function"
      ? await maybePromise
      : (context as { params: { applicationId: string } }).params;
  return params?.applicationId?.trim() ?? "";
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const applicationId = await getApplicationId(context);
    if (!applicationId) {
      return NextResponse.json({ success: false, error: "applicationId is required." }, { status: 400 });
    }

    const body = (await req.json()) as { status?: unknown };
    const status = normalizeString(body.status).toUpperCase();

    if (!["PENDING", "ACCEPTED", "REJECTED", "REVIEWED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Use PENDING, REVIEWED, ACCEPTED, or REJECTED." },
        { status: 400 }
      );
    }

    const existing = await prisma.gig_applications.findUnique({
      where: { id: applicationId },
      include: {
        gigs: {
          select: {
            company_id: true,
            title: true,
            companies: { select: { name: true } },
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
    }

    const ownerCompanyId = await resolveCompanyId(req);
    if (!ownerCompanyId || ownerCompanyId !== existing.gigs?.company_id) {
      return NextResponse.json({ success: false, error: "Not allowed to update this application." }, { status: 403 });
    }

    const prevUpper = existing.status.toUpperCase();
    const wasAlreadyAccepted = prevUpper === "ACCEPTED";
    const wasAlreadyRejected = prevUpper === "REJECTED";

    let updated;
    if (status === "REJECTED") {
      await prisma.gig_applications.delete({
        where: { id: applicationId },
      });
      updated = null;
    } else {
      updated = await prisma.gig_applications.update({
        where: { id: applicationId },
        data: { status },
      });
    }

    const founder = verifyToken(req.headers.get("authorization") || undefined);
    const companyName = existing.gigs?.companies?.name?.trim() || "A startup";
    const gigTitle = existing.gigs?.title?.trim() || "a gig";

    if (status === "ACCEPTED" && existing.gigs) {
      await recordStartupCollaboration(existing.user_id, existing.gigs.company_id, existing.gigs.title);

      if (!wasAlreadyAccepted) {
        const message = `${companyName} accepted your application for "${gigTitle}". Check Startup Connect for next steps.`;

        try {
          await prisma.app_notifications.create({
            data: {
              id: randomUUID(),
              receiver_id: existing.user_id,
              sender_id: founder?.userId ?? null,
              type: "application_accepted",
              title: "Application accepted",
              message: message.slice(0, 500),
              meta: {
                applicationId,
                gigId: existing.gig_id,
                gigTitle,
                companyName,
              },
            },
          });
        } catch (notifyErr) {
          console.error("APPLICATION_ACCEPT_NOTIFY_ERROR:", notifyErr);
        }
      }
    }

    if (status === "REJECTED") {
      if (!wasAlreadyRejected) {
        const message = `${companyName} did not move forward with your application for "${gigTitle}". You can keep browsing gigs on Startup Connect.`;
        try {
          await prisma.app_notifications.create({
            data: {
              id: randomUUID(),
              receiver_id: existing.user_id,
              sender_id: founder?.userId ?? null,
              type: "application_rejected",
              title: "Application update",
              message: message.slice(0, 500),
              meta: {
                applicationId,
                gigId: existing.gig_id,
                gigTitle,
                companyName,
              },
            },
          });
        } catch (notifyErr) {
          console.error("APPLICATION_REJECT_NOTIFY_ERROR:", notifyErr);
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("STARTUP_APPLICATION_PATCH_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to update application";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
