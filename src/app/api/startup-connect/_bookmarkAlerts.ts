import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prismaClient";
import { Resend } from "resend";

type MatchedBookmarkUser = {
  user_id: string;
  name: string | null;
  email: string | null;
  bookmarked_title: string | null;
};

type NotifyNewGigInput = {
  gigId: string;
  title: string;
  description: string;
  companyId: string;
  companyName: string;
  skills: string[];
  senderUserId?: string;
};

let tableReady = false;
let notificationsTableReady = false;

async function ensureGigBookmarksTable() {
  if (tableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS gig_bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      gig_id UUID NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT uq_gig_bookmarks_user_gig UNIQUE (user_id, gig_id),
      CONSTRAINT fk_gig_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_gig_bookmarks_gig FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_gig_bookmarks_user_created ON gig_bookmarks(user_id, created_at DESC);`
  );

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_gig_bookmarks_gig ON gig_bookmarks(gig_id);`
  );

  tableReady = true;
}

async function ensureNotificationsTable() {
  if (notificationsTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS app_notifications (
      id TEXT PRIMARY KEY,
      receiver_id TEXT NOT NULL,
      sender_id TEXT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      meta JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_app_notifications_receiver_created ON app_notifications(receiver_id, created_at DESC);`
  );

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_app_notifications_receiver_unread ON app_notifications(receiver_id, is_read);`
  );

  notificationsTableReady = true;
}

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendMatchingGigEmail(rows: MatchedBookmarkUser[], gig: NotifyNewGigInput) {
  const resend = getResendClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL || "UniNexus <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const gigUrl = `${appUrl.replace(/\/$/, "")}/startup-connect/browse-gigs`;

  await Promise.allSettled(
    rows
      .filter((row) => typeof row.email === "string" && row.email.includes("@"))
      .slice(0, 100)
      .map((row) =>
        resend.emails.send({
          from,
          to: row.email as string,
          subject: `New gig match: ${gig.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.5; color:#0f172a;">
              <h2 style="margin-bottom:8px;">Hi ${row.name || "there"},</h2>
              <p>A new gig matching your saved interests is now available:</p>
              <p><strong>${gig.title}</strong> by ${gig.companyName}</p>
              <p style="margin: 12px 0; color:#334155;">${gig.description.slice(0, 220)}</p>
              <a href="${gigUrl}" style="display:inline-block;padding:10px 16px;background:#1d4ed8;color:white;text-decoration:none;border-radius:8px;">View gig</a>
            </div>
          `,
        })
      )
  );
}

export async function notifyBookmarkedUsersAboutGig(gig: NotifyNewGigInput) {
  try {
    await ensureGigBookmarksTable();
    await ensureNotificationsTable();

    const normalizedSkills = gig.skills
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const rows = await prisma.$queryRawUnsafe<MatchedBookmarkUser[]>(
      `
      SELECT DISTINCT b.user_id, u.name, u.email, bg.title AS bookmarked_title
      FROM gig_bookmarks b
      INNER JOIN gigs bg ON bg.id = b.gig_id
      INNER JOIN users u ON u.id = b.user_id
      WHERE (
        bg.company_id = $1::uuid
        OR (
          cardinality($2::text[]) > 0
          AND EXISTS (
            SELECT 1
            FROM unnest(COALESCE(bg.requirements, ARRAY[]::text[])) AS req(skill)
            WHERE lower(req.skill) = ANY($2::text[])
          )
        )
      )
      AND b.user_id <> COALESCE($3::uuid, '00000000-0000-0000-0000-000000000000'::uuid)
      AND NOT EXISTS (
        SELECT 1
        FROM gig_applications ga
        WHERE ga.gig_id = $4::uuid
          AND ga.user_id = b.user_id
      )
      LIMIT 250
      `,
      gig.companyId,
      normalizedSkills,
      gig.senderUserId ?? null,
      gig.gigId
    );

    if (!rows.length) return { notified: 0, emailed: 0 };

    const message = `${gig.companyName} posted a new gig that matches your saved interests: ${gig.title}`;

    await prisma.app_notifications.createMany({
      data: rows.map((row) => ({
        id: randomUUID(),
        receiver_id: row.user_id,
        sender_id: gig.senderUserId ?? null,
        type: "alert",
        title: "New matching gig",
        message: message.slice(0, 500),
        meta: {
          gigId: gig.gigId,
          gigTitle: gig.title,
          companyId: gig.companyId,
          companyName: gig.companyName,
          bookmarkedTitle: row.bookmarked_title,
        },
      })),
      skipDuplicates: false,
    });

    await sendMatchingGigEmail(rows, gig);

    return {
      notified: rows.length,
      emailed: rows.filter((row) => row.email && row.email.includes("@")).length,
    };
  } catch (error) {
    console.error("BOOKMARK_GIG_NOTIFY_ERROR:", error);
    return { notified: 0, emailed: 0 };
  }
}
