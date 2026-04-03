import { z } from "zod";

export const upsertProfileSchema = z.object({
    bio: z.string().max(2000).optional().nullable(),
    github_url: z.string().url().optional().nullable().or(z.literal("")),
    linkedin_url: z.string().url().optional().nullable().or(z.literal("")),
    mobile_no: z.string().regex(/^0\d{9}$/, "Mobile number must be 10 digits and start with 0").optional().nullable(),
    group_status: z.enum(["NO_GROUP", "PENDING", "IN_GROUP"]).optional().nullable(),
    skills: z.array(z.string().max(50)).max(50).optional(),
    specialization: z.string().max(100).optional().nullable(),
    year: z.number().int().min(1).max(6).optional().nullable(),
    semester: z.number().int().min(1).max(3).optional().nullable(),
    group_number: z.string().max(20).optional().nullable(),
});
