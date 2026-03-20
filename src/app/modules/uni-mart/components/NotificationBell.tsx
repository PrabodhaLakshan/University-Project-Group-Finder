"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { getUnreadCount, markAllAsRead } from "../services/notification.service";
import Link from "next/link";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(loadUnreadCount, 30000);

    const onRefresh = () => {
      loadUnreadCount();
    };
    window.addEventListener("notifications:refresh", onRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications:refresh", onRefresh);
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      setIsLoading(true);
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        title="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Links */}
          <div className="p-4 space-y-2">
            <Link
              href="/modules/uni-mart/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition"
            >
              View All Notifications
            </Link>
            {unreadCount > 0 && (
              <button
                onClick={async () => {
                  await markAllAsRead();
                  setUnreadCount(0);
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("notifications:refresh"));
                  }
                }}
                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Empty State */}
          {unreadCount === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Bell size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm">No new notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
