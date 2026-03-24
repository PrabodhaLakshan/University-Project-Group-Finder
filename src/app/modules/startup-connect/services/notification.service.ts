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

function getDummyStartupNotifications(): { notifications: AppNotification[]; unreadCount: number } {
  const notifications: AppNotification[] = [
    {
      id: "dummy-app-1",
      title: "New Job Application",
      message: "Nimal Siriwardana applied for your gig: Java Spring Boot API Development.",
      time: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      type: "application",
      senderId: "student-1",
      meta: { gigTitle: "Java Spring Boot API Development", applicantName: "Nimal Siriwardana" },
    },
    {
      id: "dummy-app-2",
      title: "New Job Application",
      message: "Ishani Silva applied for your gig: Mobile App UI Revamp.",
      time: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      type: "application",
      senderId: "student-2",
      meta: { gigTitle: "Mobile App UI Revamp", applicantName: "Ishani Silva" },
    },
    {
      id: "dummy-app-3",
      title: "Application Status",
      message: "Kavindu Gunawardena is awaiting your response for Campus Collaboration Gig.",
      time: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      type: "application",
      senderId: "student-3",
      meta: { gigTitle: "Campus Collaboration Gig", applicantName: "Kavindu Gunawardena" },
    },
  ];

  return {
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
  };
}

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
      return getDummyStartupNotifications();
    }

    const data = (await response.json()) as { notifications: AppNotification[]; unreadCount: number };

    if (!data?.notifications?.length) {
      return getDummyStartupNotifications();
    }

    return data;
  } catch {
    return getDummyStartupNotifications();
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
