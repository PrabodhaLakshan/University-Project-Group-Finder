import { prisma } from "@/lib/prismaClient";

export async function getProfileByUserId(userId: string) {
    const user = await (prisma.users as any).findUnique({
        where: { id: userId },
        select: {
            id: true,
            student_id: true,
            name: true,
            email: true,

            specialization: true,
            year: true,
            semester: true,
            skills: true,

            bio: true,
            github_url: true,
            linkedin_url: true,
            mobile_no: true,

            group_status: true,

            rating: true,
            created_at: true,
        },
    });
    return user;
}

/** Shape accepted by the PUT route (mirrors upsertProfileSchema) */
export type UpsertProfileData = {
    bio?: string | null;
    github_url?: string | null;
    linkedin_url?: string | null;
    /** Comes in as "phone" from the schema but stored as mobile_no */
    mobile_no?: string | null;
    group_status?: string | null;
    specialization?: string | null;
    year?: number | null;
    semester?: number | null;
    skills?: string[];
};

/** Called by the PUT route */
export async function upsertProfile(userId: string, data: UpsertProfileData) {
    return (prisma.users as any).update({
        where: { id: userId },
        data: {
            ...(data.bio !== undefined ? { bio: data.bio } : {}),
            ...(data.github_url !== undefined ? { github_url: data.github_url } : {}),
            ...(data.linkedin_url !== undefined ? { linkedin_url: data.linkedin_url } : {}),
            ...(data.mobile_no !== undefined ? { mobile_no: data.mobile_no } : {}),
            ...(data.group_status !== undefined ? { group_status: data.group_status } : {}),
            ...(data.specialization !== undefined ? { specialization: data.specialization } : {}),
            ...(data.year !== undefined ? { year: data.year } : {}),
            ...(data.semester !== undefined ? { semester: data.semester } : {}),
            ...(data.skills !== undefined ? { skills: data.skills } : {}),
        },
        select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
            year: true,
            semester: true,
            skills: true,
            bio: true,
            github_url: true,
            linkedin_url: true,
            mobile_no: true,
            group_status: true,
            rating: true,
            created_at: true,
        },
    });
}

// Keep old export for backward compatibility
export const updateProfileByUserId = upsertProfile;