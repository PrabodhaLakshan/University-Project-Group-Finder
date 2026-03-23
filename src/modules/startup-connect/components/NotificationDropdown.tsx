"use client";

import React from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string | Date;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAllRead: () => void;
}

function getRelativeTime(value: string | Date) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (Number.isNaN(diffMinutes)) return "Now";
  if (diffMinutes < 1) return "Now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export const NotificationDropdown = ({ notifications, unreadCount, onMarkAllRead }: NotificationDropdownProps) => {
  return (
    <div className="w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-sky-600">{unreadCount} unread</span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[10px] font-bold uppercase text-slate-500 hover:text-sky-600"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${!notification.read ? "bg-sky-50/50" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                {!notification.read && <span className="mt-1 w-2 h-2 rounded-full bg-sky-500" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">{getRelativeTime(notification.time)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
