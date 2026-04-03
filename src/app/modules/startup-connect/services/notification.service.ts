import { getToken } from "@/lib/auth";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string | Date;
  read: boolean;
  type: string;
  senderId?: string | null;
  meta?: unknown;
}

const EMPTY_STATE: { notifications: AppNotification[]; unreadCount: number } = {
  notifications: [],
  unreadCount: 0,
};

function getAuthHeaders(): Record<string, string> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchNotifications(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  try {
    const response = await fetch(`/api/notifications${query}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      return EMPTY_STATE;
    }

    const data = (await response.json()) as {
      notifications?: AppNotification[];
      unreadCount?: number;
    };

    const notifications = Array.isArray(data?.notifications) ? data.notifications : [];
    const unreadCount =
      typeof data?.unreadCount === "number"
        ? data.unreadCount
        : notifications.filter((item) => !item.read).length;

    return { notifications, unreadCount };
  } catch {
    return EMPTY_STATE;
  }
}

export async function markAllNotificationsAsRead(userId?: string) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const response = await fetch(`/api/notifications${query}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ markAll: true }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark notifications as read");
  }

  return response.json();
}

export async function sendInviteNotification(params: {
  receiverId: string;
  studentName: string;
  gigTitle: string;
}) {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      receiverId: params.receiverId,
      type: "invite",
      title: "Startup Invitation",
      message: `You were invited by a startup to join: ${params.gigTitle}`,
      meta: {
        studentName: params.studentName,
        gigTitle: params.gigTitle,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send invite notification");
  }

  return response.json();
}

/** Founder → student message (stored as notification; shows company in title). */
export async function sendApplicantChatMessage(params: {
  receiverId: string;
  companyName: string;
  message: string;
  gigTitle?: string;
}) {
  const company = params.companyName.trim() || "Startup";
  const body = params.gigTitle?.trim()
    ? `[${params.gigTitle}] ${params.message}`
    : params.message;
  const title = `Message from ${company}`.slice(0, 120);
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      receiverId: params.receiverId,
      type: "alert",
      title,
      message: body.slice(0, 500),
      meta: {
        companyName: company,
        gigTitle: params.gigTitle ?? null,
        kind: "applicant_chat",
      },
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || "Failed to send message");
  }

  return response.json();
}

export async function sendApplicationNotification(params: {
  receiverId: string;
  gigTitle: string;
  startupName: string;
}) {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      receiverId: params.receiverId,
      type: "application",
      title: "New Job Application",
      message: `A student applied to your job: ${params.gigTitle} (${params.startupName})`,
      meta: {
        gigTitle: params.gigTitle,
        startupName: params.startupName,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send application notification");
  }

  return response.json();
}
