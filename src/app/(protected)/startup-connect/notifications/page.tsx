"use client";

import React, { useEffect, useState } from "react";
import { NotificationDropdown } from "@/modules/startup-connect/components/NotificationDropdown";
import {
  AppNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
} from "@/modules/startup-connect/services/notification.service";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      console.error("Failed to mark notifications as read");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-6">
          Notifications
        </h1>
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>
    </main>
  );
}
