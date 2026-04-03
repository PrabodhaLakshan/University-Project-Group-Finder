import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireUserFromRequest } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const year = searchParams.get("year") || undefined;
        const semester = searchParams.get("semester") || undefined;
        const batch = searchParams.get("batch") || undefined;
        const specialization = searchParams.get("specialization") || undefined;

        const currentUser = await requireUserFromRequest(req);

        const students = await prisma.users.findMany({
            where: {
                id: { not: currentUser.id }, // Rule 1: Cannot invite yourself
                year: year ? parseInt(year) : undefined,
                semester: semester ? parseInt(semester) : undefined,
                specialization: specialization || undefined,
            },
            include: {
                user_skills: true,
                project_group_members: {
                    include: {
                        project_group: true
                    }
                },
                project_group_invites_project_group_invites_receiver_idTousers: {
                    where: {
                        sender_id: currentUser.id,
                        status: "pending"
                    }
                }
            },
        });

        const currentSkills = (currentUser.skills || []).map((s) => s.toLowerCase().trim());

        const results = students.map((student) => {
            const skills = (student.skills || []).filter(Boolean);
            const normalizedSkills = skills.map((s) => s.toLowerCase().trim());

            const matchedSkills: string[] = skills.filter((skill, idx) =>
                currentSkills.includes(normalizedSkills[idx])
            );

            let matchScore = 35;

            if (student.year?.toString() === year) matchScore += 10;
            if (student.semester?.toString() === semester) matchScore += 10;
            if (student.specialization === specialization) matchScore += 15;
            if (matchedSkills.length > 0) {
                matchScore += Math.min(30, matchedSkills.length * 6);
            }

            let imageUrl: string | undefined = undefined;
            if (student.avatar_path) {
                const { data } = supabaseAdmin.storage
                    .from("avatars")
                    .getPublicUrl(student.avatar_path);
                imageUrl = data.publicUrl;
            }

            const typedStudent = student as any;
            const isInGroup = (typedStudent.project_group_members?.length || 0) > 0;
            const hasPendingInvite = typedStudent.project_group_invites_project_group_invites_receiver_idTousers.length > 0;

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                imageUrl,
                specialization: student.specialization || "Not specified",
                year: student.year?.toString(),
                semester: student.semester?.toString(),
                batch: student.group_number || undefined,
                skills,
                matchedSkills,
                matchScore: Math.min(matchScore, 100),
                isInGroup,
                hasPendingInvite
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
