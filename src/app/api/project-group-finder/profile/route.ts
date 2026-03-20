import { NextResponse } from "next/server";
import { upsertProfileSchema } from "@/app/modules/project-group-finder/validations/profile.schema";
import { getProfileByUserId, upsertProfile } from "@/app/modules/project-group-finder/services/profile.service";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const profile = await getProfileByUserId(userId);
        return NextResponse.json(profile ?? null);
    } catch {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const body = await req.json();
        const parsed = upsertProfileSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const saved = await upsertProfile(userId, parsed.data);
        return NextResponse.json(saved);
    } catch {
        return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }
}