import { prisma } from "@/lib/prismaClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

            avatar_path: true,
            group_number: true,

            rating: true,
            created_at: true,
            projects: true,
        },
    });

    if (!user) return null;

    // Build the full public URL server-side so the client never needs NEXT_PUBLIC_SUPABASE_URL
    let avatar_url: string | null = null;
    if (user.avatar_path) {
        const { data } = supabaseAdmin.storage
            .from("avatars")
            .getPublicUrl(user.avatar_path);
        avatar_url = data.publicUrl;
    }

    // Attach public URLs for each project image
    const projectsWithImages = user.projects?.map((p: any) => {
        let imageUrl: string | undefined = p.image_path || undefined;
        if (p.image_path && !p.image_path.startsWith("http")) {
            const { data } = supabaseAdmin.storage
                .from("project-images")
                .getPublicUrl(p.image_path);
            imageUrl = data.publicUrl;
        }
        return { ...p, imageUrl };
    }) || [];

    return { ...user, avatar_url, projects: projectsWithImages };
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
    group_number?: string | null;
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
            ...(data.group_number !== undefined ? { group_number: data.group_number } : {}),
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
            group_number: true,
            rating: true,
            created_at: true,
        },
    });
}

// Keep old export for backward compatibility
export const updateProfileByUserId = upsertProfile;