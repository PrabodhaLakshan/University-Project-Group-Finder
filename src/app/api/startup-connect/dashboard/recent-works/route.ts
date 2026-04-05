import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { formatDate, normalizeString, resolveCompanyId } from "../../_shared";
import { saveUploadedFile } from "../../_upload";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json({ success: true, data: [] });
    }

    let works: Array<{
      id: string;
      title: string;
      description: string;
      project_url: string | null;
      image_url: string | null;
      created_at: Date | null;
    }> = [];

    try {
      works = await prisma.company_recent_works.findMany({
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
    } catch {
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
        works = rows.map((x) => ({ ...x, project_url: null, image_url: null }));
      } catch {
        works = [];
      }
    }

    const data = works.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description,
      github: "",
      demo: work.project_url ?? "",
      date: formatDate(work.created_at),
      images: work.image_url ? [work.image_url] : [],
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("STARTUP_RECENT_WORKS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load recent works";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "No startup company found." },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const title = normalizeString(formData.get("title"));
    const description = normalizeString(formData.get("description"));
    const demo = normalizeString(formData.get("demo"));
    const github = normalizeString(formData.get("github"));
    const imageFiles = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required." },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;
    if (imageFiles.length > 0) {
      imageUrl = await saveUploadedFile(imageFiles[0]!, "portfolio");
    }

    const work = await prisma.company_recent_works.create({
      data: {
        company_id: companyId,
        title,
        description,
        project_url: demo || null,
        image_url: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: work.id,
        title: work.title,
        description: work.description,
        github: github || "",
        demo: work.project_url ?? "",
        date: formatDate(work.created_at),
        images: work.image_url ? [work.image_url] : [],
      },
    });
  } catch (error) {
    console.error("STARTUP_RECENT_WORKS_POST_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to add recent work";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
