import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { formatDate, normalizeString, resolveCompanyId } from "../../../_shared";
import { saveUploadedFile } from "../../../_upload";

export const runtime = "nodejs";

type RouteContext = { params: { workId: string } } | { params: Promise<{ workId: string }> };

async function getWorkId(context: RouteContext) {
  const maybePromise = (context as { params: Promise<{ workId: string }> }).params;
  const params =
    typeof (maybePromise as Promise<{ workId: string }>)?.then === "function"
      ? await maybePromise
      : (context as { params: { workId: string } }).params;
  return params?.workId?.trim() ?? "";
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const workId = await getWorkId(context);
    if (!workId) {
      return NextResponse.json({ success: false, error: "workId is required." }, { status: 400 });
    }

    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "No startup company found." },
        { status: 404 }
      );
    }

    const existing = await prisma.company_recent_works.findFirst({
      where: { id: workId, company_id: companyId },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    const formData = await req.formData();
    const title = normalizeString(formData.get("title"));
    const description = normalizeString(formData.get("description"));
    const demo = normalizeString(formData.get("demo"));
    const github = normalizeString(formData.get("github"));
    const imageFiles = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    const data: {
      title?: string;
      description?: string;
      project_url?: string | null;
      image_url?: string | null;
    } = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (demo !== undefined) data.project_url = demo || null;

    if (imageFiles.length > 0) {
      data.image_url = await saveUploadedFile(imageFiles[0]!, "portfolio");
    }

    const work = await prisma.company_recent_works.update({
      where: { id: workId },
      data,
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
    console.error("STARTUP_RECENT_WORKS_PATCH_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to update recent work";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const workId = await getWorkId(context);
    if (!workId) {
      return NextResponse.json({ success: false, error: "workId is required." }, { status: 400 });
    }

    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "No startup company found." },
        { status: 404 }
      );
    }

    const existing = await prisma.company_recent_works.findFirst({
      where: { id: workId, company_id: companyId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    await prisma.company_recent_works.delete({ where: { id: workId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("STARTUP_RECENT_WORKS_DELETE_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to delete recent work";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
