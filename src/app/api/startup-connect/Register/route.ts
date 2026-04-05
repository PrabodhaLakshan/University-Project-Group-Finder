import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import { saveStartupCertificate, saveStartupLogo } from "../_upload";

export const runtime = "nodejs";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const payload = verifyToken(authHeader);

    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const name = normalizeText(formData.get("name"));
    const industry = normalizeText(formData.get("industry"));
    const about = normalizeText(formData.get("about"));
    const logo = formData.get("logo");
    const certificates = formData.getAll("certificates");

    if (!name || !industry || !about) {
      return NextResponse.json(
        { success: false, error: "Name, industry, and about are required." },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authenticated user was not found." },
        { status: 404 }
      );
    }

    // Current DB schema stores one certificate URL and optional logo URL.
    // Frontend already falls back to client-side preview when URL is missing.
    const existingCompany = await prisma.companies.findFirst({
      where: { owner_id: user.id },
      orderBy: { created_at: "desc" },
    });

    let logoUrl: string | undefined;
    let certificateUrl: string | undefined;

    if (logo instanceof File && logo.size > 0) {
      logoUrl = await saveStartupLogo(logo);
    }

    const firstCertificate = certificates.find((item) => item instanceof File && item.size > 0);
    if (firstCertificate instanceof File) {
      certificateUrl = await saveStartupCertificate(firstCertificate);
    }

    const company = existingCompany
      ? await prisma.companies.update({
          where: { id: existingCompany.id },
          data: {
            name,
            industry,
            about,
            ...(logoUrl ? { logo_url: logoUrl } : {}),
            ...(certificateUrl ? { certificate_url: certificateUrl } : {}),
          },
        })
      : await prisma.companies.create({
          data: {
            owner_id: user.id,
            name,
            industry,
            about,
            ...(logoUrl ? { logo_url: logoUrl } : {}),
            ...(certificateUrl ? { certificate_url: certificateUrl } : {}),
          },
        });

    return NextResponse.json({
      success: true,
      data: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        about: company.about,
        logo_url: company.logo_url,
        certificate_url: company.certificate_url,
        certificates: company.certificate_url ? [company.certificate_url] : [],
        owner_id: company.owner_id,
      },
    });
  } catch (error) {
    console.error("STARTUP_REGISTER_ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to register startup";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
