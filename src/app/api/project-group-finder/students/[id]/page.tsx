import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";

export default async function StudentProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const student = await prisma.users.findUnique({
        where: { id: params.id },
        include: {
            user_skills: {
                include: {
                    skills: true,
                },
            },
        },
    });

    if (!student) return notFound();

    const skills = student.user_skills
        .map((item) => item.skills?.name)
        .filter(Boolean);

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                <p className="mt-1 text-sm text-slate-500">
                    {student.specialization || "Not specified"}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        Email: {student.email}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        GPA: {student.gpa ?? "N/A"}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        Year: {student.year ?? "N/A"}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        Semester: {student.semester ?? "N/A"}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        Batch: {student.batch ?? "N/A"}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-sm">
                        Availability: {student.availability ?? "N/A"}
                    </div>
                </div>

                <div className="mt-5">
                    <h2 className="mb-2 font-semibold text-slate-900">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}