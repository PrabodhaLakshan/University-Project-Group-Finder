import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const year = searchParams.get("year") || undefined;
        const semester = searchParams.get("semester") || undefined;
        const batch = searchParams.get("batch") || undefined;
        const specialization = searchParams.get("specialization") || undefined;

        const students = await prisma.users.findMany({
            where: {
                year: year ? parseInt(year) : undefined,
                semester: semester ? parseInt(semester) : undefined,
                specialization: specialization || undefined,
                group_status: {
                    in: ["PENDING", "NO_GROUP"],
                },
            },
            include: {
                user_skills: true,
            },
        });

        const results = students.map((student) => {
            const skills = student.user_skills?.map((item: any) => item.skill_id).filter(Boolean) || [];

            const matchedSkills: string[] = [];

            let matchScore = 50;

            if (student.year?.toString() === year) matchScore += 10;
            if (student.semester?.toString() === semester) matchScore += 10;
            if (student.specialization === specialization) matchScore += 15;

            let imageUrl: string | undefined = undefined;
            if (student.avatar_path) {
                const { data } = supabaseAdmin.storage
                    .from("avatars")
                    .getPublicUrl(student.avatar_path);
                imageUrl = data.publicUrl;
            }

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                imageUrl,
                specialization: student.specialization || "Not specified",
                year: student.year?.toString(),
                semester: student.semester?.toString(),
                skills,
                matchedSkills,
                matchScore: Math.min(matchScore, 100),
                groupStatus: student.group_status,
            };
        });

        results.sort((a, b) => b.matchScore - a.matchScore);

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { error: "Failed to search students" },
            { status: 500 }
        );
    }
}