import { prisma } from "@/lib/prismaClient";

/** Persist student ↔ company link so reviews are possible after the gig row is deleted. */
export async function recordStartupCollaboration(
  userId: string,
  companyId: string,
  gigTitle?: string | null
) {
  const title = gigTitle?.trim() || null;
  await prisma.startup_collaborations.upsert({
    where: {
      user_id_company_id: {
        user_id: userId,
        company_id: companyId,
      },
    },
    create: {
      user_id: userId,
      company_id: companyId,
      gig_title: title,
    },
    update: title ? { gig_title: title } : {},
  });
}
