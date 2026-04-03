// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getNotifications, markAllAsRead, markAsRead } from "../services/notification.service";
// import { ArrowLeft, Bell, Check, CheckCheck } from "lucide-react";

// interface Notification {
//   id: string;
//   receiver_id: string;
//   sender_id?: string;
//   title: string;
//   message: string;
//   type: string;
//   is_read: boolean;
//   created_at: string;
//   meta?: {
//     orderId?: string;
//     link?: string;
//   };
// }

// const notificationTypeConfig: Record<string, { icon: string; color: string; label: string }> = {
//   ORDER_PLACED: { icon: "🛒", color: "blue", label: "Order Placed" },
//   PAYMENT_UPLOADED: { icon: "📸", color: "yellow", label: "Payment Uploaded" },
//   PAYMENT_VERIFIED: { icon: "✅", color: "green", label: "Payment Verified" },
//   ORDER_REJECTED: { icon: "❌", color: "red", label: "Order Rejected" },
//   ITEM_SOLD: { icon: "💰", color: "green", label: "Item Sold" },
// };

// export default function NotificationsPage() {
//   const router = useRouter();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [total, setTotal] = useState(0);
//   const [offset, setOffset] = useState(0);
//   const limit = 20;

//   useEffect(() => {
//     loadNotifications();
//   }, [offset]);

//   const loadNotifications = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const data = await getNotifications(limit, offset);
//       setNotifications(data.notifications);
//       setTotal(data.total);
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Failed to load notifications";
//       console.error("Failed to load notifications:", error);
//       setError(errorMessage);
//       setNotifications([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const notifyUnreadCountChanged = () => {
//     if (typeof window !== "undefined") {
//       window.dispatchEvent(new CustomEvent("notifications:refresh"));
//     }
//   };

//   const getNotificationLink = (notification: Notification) => {
//     if (notification.meta?.link) {
//       return notification.meta.link;
//     }

//     const orderId = notification.meta?.orderId;
//     switch (notification.type) {
//       case "ORDER_PLACED":
//         return orderId
//           ? `/modules/uni-mart/orders/${orderId}`
//           : "/modules/uni-mart/orders/seller";
//       case "PAYMENT_UPLOADED":
//         return "/modules/uni-mart/sales";
//       case "PAYMENT_VERIFIED":
//       case "ORDER_REJECTED":
//         return orderId
//           ? `/modules/uni-mart/orders/${orderId}`
//           : "/modules/uni-mart/purchase-history";
//       case "ITEM_SOLD":
//         return "/modules/uni-mart/sales-history";
//       default:
//         return "/modules/uni-mart/notifications";
//     }
//   };

//   const handleMarkAsRead = async (notificationId: string) => {
//     try {
//       await markAsRead(notificationId);
//       setNotifications(prev =>
//         prev.map(n =>
//           n.id === notificationId ? { ...n, is_read: true } : n
//         )
//       );
//       notifyUnreadCountChanged();
//     } catch (error) {
//       console.error("Failed to mark as read:", error);
//     }
//   };

//   const handleNotificationClick = async (notification: Notification) => {
//     if (!notification.is_read) {
//       await handleMarkAsRead(notification.id);
//     }

//     router.push(getNotificationLink(notification));
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead();
//       setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
//       notifyUnreadCountChanged();
//     } catch (error) {
//       console.error("Failed to mark all as read:", error);
//     }
//   };

//   const unreadCount = notifications.filter(n => !n.is_read).length;
//   const totalPages = Math.ceil(total / limit);
//   const currentPage = Math.floor(offset / limit) + 1;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
//         >
//           <ArrowLeft size={20} />
//           Back
//         </button>

//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
//             <Bell className="text-blue-600" size={36} />
//             Notifications
//           </h1>
//           <p className="text-gray-600 mt-2">
//             {unreadCount > 0 && (
//               <span className="font-semibold">
//                 {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
//               </span>
//             )}
//             {total === 0 && "No notifications"}
//             {unreadCount === 0 && total > 0 && "All notifications read"}
//           </p>
//         </div>

//         {/* Filter/Action Buttons */}
//         {unreadCount > 0 && (
//           <div className="mb-6 flex gap-2">
//             <button
//               onClick={handleMarkAllAsRead}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
//             >
//               <CheckCheck size={18} />
//               Mark All as Read
//             </button>
//           </div>
//         )}

//         {/* Notifications List */}
//         {error ? (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//             <Bell className="mx-auto text-red-400 mb-4" size={48} />
//             <p className="text-red-700 font-semibold mb-2">Failed to Load Notifications</p>
//             <p className="text-red-600 text-sm mb-4">{error}</p>
//             <button
//               onClick={() => loadNotifications()}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
//             >
//               Retry
//             </button>
//           </div>
//         ) : isLoading && notifications.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500">Loading notifications...</p>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-12 text-center">
//             <Bell className="mx-auto text-gray-300 mb-4" size={48} />
//             <p className="text-gray-600 text-lg font-medium">No notifications yet</p>
//             <p className="text-gray-500 mt-2">You'll receive notifications when you get new orders or updates</p>
//           </div>
//         ) : (
//           <div>
//             <div className="space-y-3">
//               {notifications.map((notification) => {
//                 const config = notificationTypeConfig[notification.type] || notificationTypeConfig.ORDER_PLACED;
//                 const colorClasses = {
//                   blue: "bg-blue-50 border-blue-200",
//                   yellow: "bg-yellow-50 border-yellow-200",
//                   green: "bg-green-50 border-green-200",
//                   red: "bg-red-50 border-red-200",
//                 };

//                 return (
//                   <div
//                     key={notification.id}
//                     onClick={() => handleNotificationClick(notification)}
//                     className={`bg-white rounded-lg border-l-4 p-4 transition ${
//                       notification.is_read ? "opacity-75" : colorClasses[config.color as keyof typeof colorClasses]
//                     } cursor-pointer`}
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(event) => {
//                       if (event.key === "Enter" || event.key === " ") {
//                         event.preventDefault();
//                         handleNotificationClick(notification);
//                       }
//                     }}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3">
//                           <span className="text-2xl">{config.icon}</span>
//                           <div>
//                             <h3 className="font-semibold text-gray-900">
//                               {notification.title}
//                             </h3>
//                             <p className="text-gray-600 text-sm mt-1">
//                               {notification.message}
//                             </p>
//                             <p className="text-gray-500 text-xs mt-2">
//                               {new Date(notification.created_at).toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="ml-4 flex gap-2">
//                         {!notification.is_read && (
//                           <button
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               handleMarkAsRead(notification.id);
//                             }}
//                             className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
//                             title="Mark as read"
//                           >
//                             <Check size={20} />
//                           </button>
//                         )}
//                         {notification.is_read && (
//                           <div className="p-2 text-gray-400">
//                             <CheckCheck size={20} />
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Unread Indicator */}
//                     {!notification.is_read && (
//                       <div className="mt-3 absolute left-0 top-0 bottom-0 left-0 w-1 bg-blue-600 rounded-l-lg"></div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-8 flex justify-center gap-2">
//                 <button
//                   onClick={() => setOffset(Math.max(0, offset - limit))}
//                   disabled={offset === 0}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                 >
//                   Previous
//                 </button>
//                 <div className="flex items-center gap-2">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => setOffset((page - 1) * limit)}
//                       className={`px-3 py-2 rounded transition ${
//                         currentPage === page
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => setOffset(Math.min((totalPages - 1) * limit, offset + limit))}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Oxanium } from "next/font/google";
import { getNotifications, markAllAsRead, markAsRead } from "../services/notification.service";
import { 
  ArrowLeft, Bell, Check, CheckCheck, Loader2, AlertCircle,
  ShoppingCart, UploadCloud, ShieldCheck, XOctagon, BadgeDollarSign, MessageSquare,
  ChevronLeft, ChevronRight
} from "lucide-react";

// Initialize Oxanium font
const oxanium = Oxanium({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"] 
});

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

// Updated Config with Lucide Icons and Tailwind styling classes
const notificationTypeConfig: Record<string, { icon: any; bg: string; text: string; border: string }> = {
  ORDER_PLACED: { icon: ShoppingCart, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  PAYMENT_UPLOADED: { icon: UploadCloud, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  PAYMENT_VERIFIED: { icon: ShieldCheck, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  ORDER_REJECTED: { icon: XOctagon, bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  ITEM_SOLD: { icon: BadgeDollarSign, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  DEFAULT: { icon: MessageSquare, bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-100" }
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
    <div className={`min-h-screen bg-gray-50/50 py-8 px-4 ${oxanium.className}`}>
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-6 w-fit"
        >
          <div className="p-1.5 rounded-md bg-white border border-gray-200 shadow-sm group-hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back
        </button>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
              <div className="relative">
                <Bell className="text-blue-600" size={32} />
                {unreadCount > 0 && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-50"></div>
                )}
              </div>
              Notifications
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              {unreadCount > 0 ? (
                <span>You have <span className="text-blue-600 font-bold">{unreadCount}</span> unread messages</span>
              ) : total > 0 ? (
                "You're all caught up!"
              ) : (
                "No notifications available"
              )}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all shadow-sm text-sm shrink-0"
            >
              <CheckCheck size={18} className="text-blue-600" />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications List Area */}
        {error ? (
          <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-10 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Data</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => loadNotifications()}
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : isLoading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Fetching your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="text-gray-300" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              You'll receive alerts here when you get new orders, messages, or account updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const config = notificationTypeConfig[notification.type] || notificationTypeConfig.DEFAULT;
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 cursor-pointer border shadow-sm hover:shadow-md animate-in slide-in-from-bottom-2 fade-in ${
                    notification.is_read 
                      ? "bg-white border-gray-100" 
                      : "bg-blue-50/40 border-blue-100 hover:bg-white"
                  }`}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                  {/* Unread dot indicator */}
                  {!notification.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon Box */}
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border ${config.bg} ${config.text} ${config.border}`}>
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold truncate ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${notification.is_read ? 'text-gray-500' : 'text-gray-600 font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 font-medium">
                        {new Date(notification.created_at).toLocaleString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                    {!notification.is_read ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    ) : (
                      <div className="p-2 text-gray-300">
                        <CheckCheck size={20} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modern Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setOffset((page - 1) * limit)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    currentPage === page
                      ? "bg-gray-900 text-white shadow-md scale-105"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOffset(Math.min((totalPages - 1) * limit, offset + limit))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}