"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getNotifications, markAllAsRead, markAsRead } from "../services/notification.service";
import { ArrowLeft, Bell, Check, CheckCheck } from "lucide-react";

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

const notificationTypeConfig: Record<string, { icon: string; color: string; label: string }> = {
  ORDER_PLACED: { icon: "🛒", color: "blue", label: "Order Placed" },
  PAYMENT_UPLOADED: { icon: "📸", color: "yellow", label: "Payment Uploaded" },
  PAYMENT_VERIFIED: { icon: "✅", color: "green", label: "Payment Verified" },
  ORDER_REJECTED: { icon: "❌", color: "red", label: "Order Rejected" },
  ITEM_SOLD: { icon: "💰", color: "green", label: "Item Sold" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadNotifications();
  }, [offset]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNotifications(limit, offset);
      setNotifications(data.notifications);
      setTotal(data.total);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load notifications";
      console.error("Failed to load notifications:", error);
      setError(errorMessage);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const notifyUnreadCountChanged = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("notifications:refresh"));
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.meta?.link) {
      return notification.meta.link;
    }

    const orderId = notification.meta?.orderId;
    switch (notification.type) {
      case "ORDER_PLACED":
        return orderId
          ? `/modules/uni-mart/orders/${orderId}`
          : "/modules/uni-mart/orders/seller";
      case "PAYMENT_UPLOADED":
        return "/modules/uni-mart/sales";
      case "PAYMENT_VERIFIED":
      case "ORDER_REJECTED":
        return orderId
          ? `/modules/uni-mart/orders/${orderId}`
          : "/modules/uni-mart/purchase-history";
      case "ITEM_SOLD":
        return "/modules/uni-mart/sales-history";
      default:
        return "/modules/uni-mart/notifications";
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      notifyUnreadCountChanged();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

    router.push(getNotificationLink(notification));
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      notifyUnreadCountChanged();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="text-blue-600" size={36} />
            Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 && (
              <span className="font-semibold">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </span>
            )}
            {total === 0 && "No notifications"}
            {unreadCount === 0 && total > 0 && "All notifications read"}
          </p>
        </div>

        {/* Filter/Action Buttons */}
        {unreadCount > 0 && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              <CheckCheck size={18} />
              Mark All as Read
            </button>
          </div>
        )}

        {/* Notifications List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Bell className="mx-auto text-red-400 mb-4" size={48} />
            <p className="text-red-700 font-semibold mb-2">Failed to Load Notifications</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => loadNotifications()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Retry
            </button>
          </div>
        ) : isLoading && notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium">No notifications yet</p>
            <p className="text-gray-500 mt-2">You'll receive notifications when you get new orders or updates</p>
          </div>
        ) : (
          <div>
            <div className="space-y-3">
              {notifications.map((notification) => {
                const config = notificationTypeConfig[notification.type] || notificationTypeConfig.ORDER_PLACED;
                const colorClasses = {
                  blue: "bg-blue-50 border-blue-200",
                  yellow: "bg-yellow-50 border-yellow-200",
                  green: "bg-green-50 border-green-200",
                  red: "bg-red-50 border-red-200",
                };

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-white rounded-lg border-l-4 p-4 transition ${
                      notification.is_read ? "opacity-75" : colorClasses[config.color as keyof typeof colorClasses]
                    } cursor-pointer`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleNotificationClick(notification);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{config.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex gap-2">
                        {!notification.is_read && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="Mark as read"
                          >
                            <Check size={20} />
                          </button>
                        )}
                        {notification.is_read && (
                          <div className="p-2 text-gray-400">
                            <CheckCheck size={20} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.is_read && (
                      <div className="mt-3 absolute left-0 top-0 bottom-0 left-0 w-1 bg-blue-600 rounded-l-lg"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setOffset((page - 1) * limit)}
                      className={`px-3 py-2 rounded transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setOffset(Math.min((totalPages - 1) * limit, offset + limit))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
