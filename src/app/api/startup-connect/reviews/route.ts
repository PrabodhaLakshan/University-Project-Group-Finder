import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import {
  COMPANY_UUID_RE,
  normalizeString,
  resolveCompanyIdForReviews,
  resolveOwnedCompanyForReviews,
} from "../_shared";
import { hasGigCompletionApproval } from "../_completion";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const scope = normalizeString(url.searchParams.get("scope")).toLowerCase();

    if (scope === "my") {
      const authHeader = req.headers.get("authorization") || undefined;
      const payload = verifyToken(authHeader);
      if (!payload?.userId) {
        return NextResponse.json({ success: false, error: "Sign in required." }, { status: 401 });
      }

      const nameFilter = normalizeString(url.searchParams.get("companyName"));
      const reviews = await prisma.company_reviews.findMany({
        where: {
          user_id: payload.userId,
          ...(nameFilter.length > 0
            ? { companies: { name: { contains: nameFilter, mode: "insensitive" } } }
            : {}),
        },
        include: {
          users: {
            select: { id: true, name: true, specialization: true },
          },
          companies: {
            select: { id: true, name: true },
          },
        },
        orderBy: { created_at: "desc" },
      });

      return NextResponse.json({
        success: true,
        data: reviews.map((review) => ({
          id: review.id,
          studentName: review.users?.name ?? "Anonymous",
          role: review.users?.specialization ?? "Student",
          comment: review.comment,
          rating: review.rating,
          date: review.created_at,
          companyId: review.company_id,
          companyName: review.companies?.name ?? "",
          userId: review.user_id,
        })),
      });
    }

    const authHeader = req.headers.get("authorization") || undefined;
    const listPayload = verifyToken(authHeader);

    const userOwnsCompany = listPayload?.userId
      ? !!(await prisma.companies.findFirst({
          where: { owner_id: listPayload.userId },
          select: { id: true },
        }))
      : false;

    let companyId: string | null = null;

    if (userOwnsCompany && listPayload?.userId) {
      companyId = await resolveOwnedCompanyForReviews(url, listPayload.userId);
      if (!companyId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Company not found or does not belong to your account. Use your registered company name exactly as on UniNexus.",
          },
          { status: 404 }
        );
      }
    } else {
      companyId = await resolveCompanyIdForReviews(req, url.searchParams.get("companyId"));
      if (!companyId) {
        return NextResponse.json({ success: false, error: "No startup company found." }, { status: 404 });
      }
    }

    const reviews = await prisma.company_reviews.findMany({
      where: { company_id: companyId },
      include: {
        users: {
          select: { id: true, name: true, specialization: true },
        },
        companies: {
          select: { id: true, name: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: reviews.map((review) => ({
        id: review.id,
        studentName: review.users?.name ?? "Anonymous",
        role: review.users?.specialization ?? "Student",
        comment: review.comment,
        rating: review.rating,
        date: review.created_at,
        companyId: review.company_id,
        companyName: review.companies?.name ?? "",
        userId: review.user_id,
      })),
    });
  } catch (error) {
    console.error("STARTUP_REVIEWS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const payload = verifyToken(authHeader);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Sign in to submit a review." }, { status: 401 });
    }

    const body = (await req.json()) as {
      companyId?: unknown;
      companyName?: unknown;
      userId?: unknown;
      comment?: unknown;
      rating?: unknown;
    };

    const companyIdRaw = normalizeString(body.companyId);
    const companyNameRaw = normalizeString(body.companyName);

    const hasUuid = Boolean(companyIdRaw && COMPANY_UUID_RE.test(companyIdRaw));
    if (!hasUuid && companyNameRaw.length < 2) {
      return NextResponse.json(
        { success: false, error: "Enter the company name (at least 2 characters) or a valid company id." },
        { status: 400 }
      );
    }

    const companySelect = { id: true, owner_id: true, name: true } as const;

    let company: { id: string; owner_id: string; name: string } | null = null;

    if (hasUuid) {
      company = await prisma.companies.findUnique({
        where: { id: companyIdRaw },
        select: companySelect,
      });
    } else {
      company = await prisma.companies.findFirst({
        where: { name: { equals: companyNameRaw, mode: "insensitive" } },
        select: companySelect,
      });
    }

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company not found. Enter the exact startup name registered on UniNexus, or pick one from your work list.",
        },
        { status: 404 }
      );
    }
    if (company.owner_id === payload.userId) {
      return NextResponse.json({ success: false, error: "You cannot review your own company." }, { status: 403 });
    }

    // Student can submit a review only after the founder marks the collaboration as completed.
    const completionApproved = await hasGigCompletionApproval(payload.userId, company.id);

    if (!completionApproved) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You can review this startup only after the founder marks your collaboration as completed.",
        },
        { status: 403 }
      );
    }

    const comment = normalizeString(body.comment);
    const ratingValue =
      typeof body.rating === "number" ? body.rating : parseInt(normalizeString(body.rating), 10);
    const rating = Number.isFinite(ratingValue) ? ratingValue : NaN;

    if (!comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "comment and rating (1–5) are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.company_reviews.findFirst({
      where: { company_id: company.id, user_id: payload.userId },
      select: { id: true },
    });

    const includes = {
      users: { select: { name: true, specialization: true } },
      companies: { select: { id: true, name: true } },
    } as const;

    const saved = existing
      ? await prisma.company_reviews.update({
          where: { id: existing.id },
          data: { comment, rating },
          include: includes,
        })
      : await prisma.company_reviews.create({
          data: {
            company_id: company.id,
            user_id: payload.userId,
            comment,
            rating,
          },
          include: includes,
        });

    return NextResponse.json({
      success: true,
      data: {
        id: saved.id,
        studentName: saved.users?.name ?? "Anonymous",
        role: saved.users?.specialization ?? "Student",
        comment: saved.comment,
        rating: saved.rating,
        date: saved.created_at,
        companyId: saved.company_id,
        companyName: saved.companies?.name ?? company.name,
        userId: saved.user_id,
      },
    });
  } catch (error) {
    console.error("STARTUP_REVIEWS_POST_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to add review";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
