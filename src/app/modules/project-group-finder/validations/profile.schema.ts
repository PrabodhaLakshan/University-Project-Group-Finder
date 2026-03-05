import { z } from "zod";

export const upsertProfileSchema = z.object({
    bio: z.string().max(2000).optional().nullable(),
    github_url: z.string().url().optional().nullable().or(z.literal("")),
    linkedin_url: z.string().url().optional().nullable().or(z.literal("")),
    mobile_no: z.string().min(7).max(20).optional().nullable(),
});