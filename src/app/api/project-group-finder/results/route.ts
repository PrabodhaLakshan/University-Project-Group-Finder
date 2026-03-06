import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

// GET /api/project-group-finder/results?userId=<id>
// Returns saved (published) marks for the user as a flat Mark[] array
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const results = await prisma.results.findMany({
            where: { user_id: userId },
            include: { subjects: true },
        });

        // Flatten to Mark[] shape
        const marks = results.flatMap((r) =>
            r.subjects.map((s) => ({
                moduleCode: s.subject_name ?? "",
                moduleName: s.subject_name ?? "",
                grade: s.grade ?? "",
                marks: s.marks ?? 0,
                semester: r.semester ?? undefined,
            }))
        );

        // Find the first non-null GPA among the semester results
        const gpa = results.find((r) => r.gpa)?.gpa || null;

        return NextResponse.json({ marks, gpa });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to fetch results" }, { status: 500 });
    }
}
