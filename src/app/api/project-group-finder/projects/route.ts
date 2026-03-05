import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

// GET /api/project-group-finder/projects?userId=<id>
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const projects = await prisma.projects.findMany({
            where: { user_id: userId },
            orderBy: { created_at: "desc" },
        });

        return NextResponse.json(projects);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to fetch projects" }, { status: 500 });
    }
}

// POST /api/project-group-finder/projects
// Body: { userId, title, description?, github_url?, live_url?, image_path? }
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, title, description, github_url, live_url, image_path } = body;

        if (!userId || !title) {
            return NextResponse.json({ error: "userId and title are required" }, { status: 400 });
        }

        const project = await prisma.projects.create({
            data: {
                user_id: userId,
                title,
                description: description || null,
                github_url: github_url || null,
                live_url: live_url || null,
                image_path: image_path || null,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to create project" }, { status: 500 });
    }
}

// DELETE /api/project-group-finder/projects?projectId=<id>
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json({ error: "projectId is required" }, { status: 400 });
        }

        await prisma.projects.delete({ where: { id: projectId } });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to delete project" }, { status: 500 });
    }
}
