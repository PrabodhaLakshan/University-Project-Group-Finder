"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { getToken } from "@/lib/auth";

type NotificationItem = {
  id: string;
  title: string | null;
  message: string | null;
  is_read: boolean | null;
  created_at: string | null;
};

export default function StudentNotificationsPanel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/tutor-connect/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Failed to load notifications");
        setLoading(false);
        return;
      }

      const data: NotificationItem[] = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Load notifications error:", err);
      setError("Something went wrong while loading notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`/api/tutor-connect/notifications/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Bell className="w-6 h-6 text-blue-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-800">Notifications</h3>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading notifications...</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-sm text-slate-500">No notifications</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 ${
                item.is_read
                  ? "bg-slate-50 border-slate-100"
                  : "bg-blue-50 border-blue-100"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {item.title || "Notification"}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {item.message || ""}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : ""}
                  </p>
                </div>

                {!item.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}