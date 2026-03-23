import { prisma } from "@/lib/prismaClient";
import { verifyToken } from "@/lib/auth";
import {
  hasLengthBetween,
  isAllowedNotificationType,
  normalizeString,
  isValidId,
} from "@/lib/validation";

export const runtime = "nodejs";

type NotificationRow = {
  id: string;
  receiver_id: string;
  sender_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  meta: unknown;
  created_at: Date;
};

let tableReady = false;

async function ensureNotificationsTable() {
  if (tableReady) return;

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

  tableReady = true;
}

function getUserId(req: Request) {
  const authHeader = req.headers.get("authorization") || undefined;
  const payload = verifyToken(authHeader);

  if (payload?.userId) {
    return payload.userId;
  }

  const { searchParams } = new URL(req.url);
  const fallbackUserId = searchParams.get("userId");
  return fallbackUserId || null;
}

export async function GET(req: Request) {
  await ensureNotificationsTable();

  const userId = getUserId(req);

  if (!userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.$queryRawUnsafe<NotificationRow[]>(
    `
      SELECT id, receiver_id, sender_id, type, title, message, is_read, meta, created_at
      FROM app_notifications
      WHERE receiver_id = $1
      ORDER BY created_at DESC
      LIMIT 30
    `,
    userId
  );

  const unreadCount = rows.filter((row) => !row.is_read).length;

  const notifications = rows.map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    time: row.created_at,
    read: row.is_read,
    type: row.type,
    senderId: row.sender_id,
    meta: row.meta,
  }));

  return Response.json({ notifications, unreadCount });
}

export async function POST(req: Request) {
  await ensureNotificationsTable();

  const authHeader = req.headers.get("authorization") || undefined;
  const payload = verifyToken(authHeader);

  const body = await req.json().catch(() => null);

  const receiverId = normalizeString(body?.receiverId);
  const title = normalizeString(body?.title);
  const message = normalizeString(body?.message);
  const type = normalizeString(body?.type);

  if (!receiverId || !title || !message || !type) {
    return Response.json({ message: "Invalid notification payload" }, { status: 400 });
  }

  if (!isValidId(receiverId)) {
    return Response.json({ message: "Invalid receiverId" }, { status: 400 });
  }

  if (!isAllowedNotificationType(type)) {
    return Response.json({ message: "Invalid notification type" }, { status: 400 });
  }

  if (!hasLengthBetween(title, 2, 120) || !hasLengthBetween(message, 2, 500)) {
    return Response.json({ message: "Invalid title or message length" }, { status: 400 });
  }

  const senderId = payload?.userId || body.senderId || "system";
  const id = crypto.randomUUID();

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO app_notifications (id, receiver_id, sender_id, type, title, message, is_read, meta)
      VALUES ($1, $2, $3, $4, $5, $6, FALSE, $7::jsonb)
    `,
    id,
    receiverId,
    String(senderId),
    type,
    title,
    message,
    JSON.stringify(body.meta ?? {})
  );

  return Response.json({ success: true, id }, { status: 201 });
}

export async function PATCH(req: Request) {
  await ensureNotificationsTable();

  const userId = getUserId(req);

  if (!userId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const markAll = Boolean(body?.markAll ?? true);

  if (!markAll) {
    return Response.json({ message: "Unsupported patch operation" }, { status: 400 });
  }

  await prisma.$executeRawUnsafe(
    `
      UPDATE app_notifications
      SET is_read = TRUE
      WHERE receiver_id = $1 AND is_read = FALSE
    `,
    userId
  );

  return Response.json({ success: true });
}
