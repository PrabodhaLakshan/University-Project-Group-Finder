import { prisma } from "@/lib/prismaClient";

let completionTableReady = false;

type CompletionInput = {
  applicationId: string;
  userId: string;
  companyId: string;
  gigId: string;
};

export async function ensureGigCompletionApprovalsTable() {
  if (completionTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS gig_completion_approvals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id UUID NOT NULL UNIQUE,
      user_id UUID NOT NULL,
      company_id UUID NOT NULL,
      gig_id UUID NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_gig_completion_approvals_application FOREIGN KEY (application_id) REFERENCES gig_applications(id) ON DELETE CASCADE,
      CONSTRAINT fk_gig_completion_approvals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_gig_completion_approvals_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
      CONSTRAINT fk_gig_completion_approvals_gig FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_gig_completion_approvals_user_company ON gig_completion_approvals(user_id, company_id);`
  );

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_gig_completion_approvals_gig_id ON gig_completion_approvals(gig_id);`
  );

  completionTableReady = true;
}

export async function recordGigCompletionApproval(input: CompletionInput) {
  await ensureGigCompletionApprovalsTable();

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO gig_completion_approvals (application_id, user_id, company_id, gig_id)
      VALUES ($1::uuid, $2::uuid, $3::uuid, $4::uuid)
      ON CONFLICT (application_id)
      DO UPDATE SET created_at = EXCLUDED.created_at
    `,
    input.applicationId,
    input.userId,
    input.companyId,
    input.gigId
  );
}

export async function hasGigCompletionApproval(userId: string, companyId: string) {
  await ensureGigCompletionApprovalsTable();

  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `
      SELECT id
      FROM gig_completion_approvals
      WHERE user_id = $1::uuid AND company_id = $2::uuid
      LIMIT 1
    `,
    userId,
    companyId
  );

  return rows.length > 0;
}

export async function countGigCompletionApprovalsByGigIds(gigIds: string[]) {
  await ensureGigCompletionApprovalsTable();

  if (gigIds.length === 0) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRawUnsafe<{ gig_id: string; count: number | string }[]>(
    `
      SELECT gig_id, COUNT(*)::int AS count
      FROM gig_completion_approvals
      WHERE gig_id = ANY($1::uuid[])
      GROUP BY gig_id
    `,
    gigIds
  );

  return new Map(rows.map((row) => [row.gig_id, Number(row.count)]));
}

export async function getGigCompletionApproval(applicationId: string) {
  await ensureGigCompletionApprovalsTable();

  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `
      SELECT id
      FROM gig_completion_approvals
      WHERE application_id = $1::uuid
      LIMIT 1
    `,
    applicationId
  );

  return rows.length > 0;
}
