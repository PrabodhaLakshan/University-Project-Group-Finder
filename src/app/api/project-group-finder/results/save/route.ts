import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

type IncomingMark = {
    moduleCode: string;
    moduleName: string;
    grade: string;
    marks: number;
    semester?: string;
};

// POST /api/project-group-finder/results/save
// Body: { userId: string, marks: IncomingMark[], gpa?: string | null }
// Replaces all stored results for the user with the provided marks
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, marks, gpa } = body as { userId: string; marks: IncomingMark[]; gpa?: string | null };

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Delete all existing results (subjects cascade via schema)
        await prisma.results.deleteMany({ where: { user_id: userId } });

        if (!marks || marks.length === 0) {
            return NextResponse.json({ saved: 0 });
        }

        // Group marks by semester tag (e.g. "Y1S1") so we can create one results row per semester
        const bySemester = new Map<string, IncomingMark[]>();
        for (const m of marks) {
            const key = m.semester ?? "Unknown";
            if (!bySemester.has(key)) bySemester.set(key, []);
            bySemester.get(key)!.push(m);
        }

        let totalSubjects = 0;

        for (const [semester, semMarks] of bySemester.entries()) {
            // Use the first mark's grade as the top-level grade (or aggregate)
            const result = await prisma.results.create({
                data: {
                    user_id: userId,
                    module: `${semester} results`,
                    grade: semMarks[0]?.grade ?? "",
                    semester,
                    gpa: gpa || null,
                },
            });

            await prisma.subjects.createMany({
                data: semMarks.map((m) => ({
                    result_id: result.id,
                    subject_name: m.moduleCode,
                    grade: m.grade,
                    marks: Math.round(m.marks),
                })),
            });

            totalSubjects += semMarks.length;
        }

        return NextResponse.json({ saved: totalSubjects });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to save results" }, { status: 500 });
    }
}
