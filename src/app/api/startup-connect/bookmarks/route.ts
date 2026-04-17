import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

type BookmarkRow = {
  gig_id: string;
};

let tableReady = false;

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

function getUserId(req: Request) {
  const authHeader = req.headers.get("authorization") || undefined;
  const payload = verifyToken(authHeader);
  return payload?.userId ?? null;
}

function parseGigId(req: Request, bodyGigId?: unknown) {
  const fromBody = typeof bodyGigId === "string" ? bodyGigId.trim() : "";
  if (fromBody) return fromBody;

  const url = new URL(req.url);
  return (url.searchParams.get("gigId") || "").trim();
}

export async function GET(req: Request) {
  try {
    await ensureGigBookmarksTable();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const rows = await prisma.$queryRawUnsafe<BookmarkRow[]>(
      `
        SELECT gig_id
        FROM gig_bookmarks
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      userId
    );

    const gigIds = rows.map((row) => row.gig_id);
    return NextResponse.json({ success: true, gigIds });
  } catch (error) {
    console.error("BOOKMARKS_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to load bookmarks";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureGigBookmarksTable();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const gigId = parseGigId(req, body?.gigId);

    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required" }, { status: 400 });
    }

    const gig = await prisma.gigs.findUnique({
      where: { id: gigId },
      select: { id: true, status: true },
    });

    if (!gig || gig.status === "CLOSED") {
      return NextResponse.json({ success: false, error: "Gig not available" }, { status: 404 });
    }

    await prisma.$executeRawUnsafe(
      `
        INSERT INTO gig_bookmarks (user_id, gig_id)
        VALUES ($1::uuid, $2::uuid)
        ON CONFLICT (user_id, gig_id) DO NOTHING
      `,
      userId,
      gigId
    );

    return NextResponse.json({ success: true, gigId });
  } catch (error) {
    console.error("BOOKMARKS_POST_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to save bookmark";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureGigBookmarksTable();

    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const gigId = parseGigId(req, body?.gigId);

    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required" }, { status: 400 });
    }

    await prisma.$executeRawUnsafe(
      `
        DELETE FROM gig_bookmarks
        WHERE user_id = $1::uuid AND gig_id = $2::uuid
      `,
      userId,
      gigId
    );

    return NextResponse.json({ success: true, gigId });
  } catch (error) {
    console.error("BOOKMARKS_DELETE_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to remove bookmark";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
