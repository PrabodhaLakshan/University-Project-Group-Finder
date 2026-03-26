import { getToken } from "@/lib/auth";

const API_BASE = "/api/uni-mart";

interface Notification {
  id: string;
  receiver_id: string;
  sender_id?: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  meta?: {
    orderId?: string;
    link?: string;
  };
}

interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  limit: number;
  offset: number;
}

// Fetch user's notifications
export const getNotifications = async (
  limit: number = 50,
  offset: number = 0
): Promise<NotificationsResponse> => {
  try {
    const token = getToken();
    const url = `${API_BASE}/notifications?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Notifications API error: ${response.status}`, errorData);
      throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("getNotifications error:", error);
    throw error;
  }
};

// Get unread notification count
export const getUnreadCount = async (): Promise<number> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/notifications/unread-count`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Unread count API error: ${response.status}`, errorData);
      throw new Error(`Failed to fetch unread count: ${response.status}`);
    }
    const data = await response.json();
    return data.unreadCount;
  } catch (error) {
    console.error("getUnreadCount error:", error);
    return 0; // Return 0 as default to avoid breaking the UI
  }
};

// Mark notification as read
export const markAsRead = async (notificationId: string): Promise<{ success: boolean; id: string; is_read: boolean }> => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/notifications/${notificationId}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Mark as read API error: ${response.status}`, errorData);
      throw new Error(`Failed to mark notification as read: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("markAsRead error:", error);
    throw error;
  }
};

// Mark all as read (optional utility)
export const markAllAsRead = async (): Promise<void> => {
  const token = getToken();
  const { notifications } = await getNotifications(1000, 0);
  
  await Promise.all(
    notifications
      .filter(n => !n.is_read)
      .map(n => markAsRead(n.id))
  );
};
