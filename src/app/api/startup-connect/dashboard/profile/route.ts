import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { normalizeString, resolveCompanyId } from "../../_shared";
import { saveStartupCertificate, saveStartupLogo } from "../../_upload";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const companyIdFromForm = normalizeString(formData.get("companyId"));
    const companyId = await resolveCompanyId(req, companyIdFromForm);

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "No startup company found." },
        { status: 404 }
      );
    }

    const name = normalizeString(formData.get("name"));
    const industry = normalizeString(formData.get("industry"));
    const about = normalizeString(formData.get("about"));
    const logo = formData.get("logo");
    const certificates = formData.getAll("certificates");

    const data: {
      name?: string;
      industry?: string;
      about?: string;
      logo_url?: string;
      certificate_url?: string;
    } = {};
    if (name) data.name = name;
    if (industry) data.industry = industry;
    if (about) data.about = about;

    if (logo instanceof File && logo.size > 0) {
      data.logo_url = await saveStartupLogo(logo);
    }

    const firstCertificate = certificates.find((item) => item instanceof File && item.size > 0);
    if (firstCertificate instanceof File) {
      data.certificate_url = await saveStartupCertificate(firstCertificate);
    }

    const company = await prisma.companies.update({
      where: { id: companyId },
      data,
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          about: company.about,
          logoUrl: company.logo_url,
          certificateUrls: company.certificate_url ? [company.certificate_url] : [],
        },
      },
    });
  } catch (error) {
    console.error("STARTUP_DASHBOARD_PROFILE_PATCH_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
