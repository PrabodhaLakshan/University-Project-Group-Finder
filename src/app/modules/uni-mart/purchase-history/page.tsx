// // // // "use client";

// // // // import { useState, useEffect } from "react";
// // // // import { useRouter } from "next/navigation";
// // // // import { ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, Filter, Star } from "lucide-react";
// // // // import { getToken } from "@/lib/auth";
// // // // import { startConversation } from "../services/message.service";
// // // // import { ReviewForm } from "../components/ReviewForm";

// // // // interface Order {
// // // //   id: string;
// // // //   productId: string;
// // // //   paymentMethod: "BANK" | "CARD";
// // // //   paymentStatus: "PENDING" | "PAID" | "VERIFIED";
// // // //   createdAt: string;
// // // //   product: {
// // // //     id: string;
// // // //     title: string;
// // // //     price: number;
// // // //     images: string[];
// // // //     seller: {
// // // //       id: string;
// // // //       name: string;
// // // //       email: string;
// // // //     };
// // // //   };
// // // // }

// // // // export default function PurchaseHistoryPage() {
// // // //   const router = useRouter();
// // // //   const [orders, setOrders] = useState<Order[]>([]);
// // // //   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [chatLoadingOrderId, setChatLoadingOrderId] = useState<string | null>(null);
// // // //   const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  
// // // //   // Filter states
// // // //   const [statusFilter, setStatusFilter] = useState<string>("ALL");
// // // //   const [dateFilter, setDateFilter] = useState<string>("ALL");

// // // //   useEffect(() => {
// // // //     loadOrders();
// // // //   }, []);

// // // //   // Apply filters whenever filter state changes
// // // //   useEffect(() => {
// // // //     applyFilters();
// // // //   }, [orders, statusFilter, dateFilter]);

// // // //   const loadOrders = async () => {
// // // //     try {
// // // //       setIsLoading(true);
// // // //       setError(null); // Clear previous errors
// // // //       const token = getToken();

// // // //       console.log("[Purchase History] Token:", token ? "Present" : "Missing");

// // // //       if (!token) {
// // // //         console.log("[Purchase History] No token, redirecting to login");
// // // //         router.push("/login");
// // // //         return;
// // // //       }

// // // //       console.log("[Purchase History] Fetching orders from API...");
// // // //       let response = await fetch("/api/unimart/orders/buyer", {
// // // //         headers: {
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //       });

// // // //       if (response.status === 404) {
// // // //         response = await fetch("/api/uni-mart/orders", {
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`,
// // // //           },
// // // //         });
// // // //       }

// // // //       console.log("[Purchase History] Response status:", response.status);

// // // //       if (!response.ok) {
// // // //         const raw = await response.text();
// // // //         if (response.status === 401) {
// // // //           router.push("/login");
// // // //           return;
// // // //         }

// // // //         let errorData: any = null;
// // // //         try {
// // // //           errorData = raw ? JSON.parse(raw) : null;
// // // //         } catch {
// // // //           errorData = null;
// // // //         }
// // // //         const fallbackMessage = raw?.trim()
// // // //           ? raw.slice(0, 200)
// // // //           : `${response.status} ${response.statusText}`;

// // // //         console.error("[Purchase History] Error details:", {
// // // //           status: response.status,
// // // //           statusText: response.statusText,
// // // //           url: response.url,
// // // //           parsed: errorData,
// // // //           raw: raw?.slice(0, 200) || "<empty>",
// // // //         });

// // // //         throw new Error(errorData?.error || `Failed to load orders: ${fallbackMessage}`);
// // // //       }

// // // //       const data = await response.json();
// // // //       console.log("[Purchase History] Received data:", data);
// // // //       console.log("[Purchase History] Orders count:", data.orders?.length || 0);
      
// // // //       setOrders(Array.isArray(data) ? data : data.orders || []);
// // // //     } catch (err) {
// // // //       console.error("[Purchase History] Load error:", err);
// // // //       const message = err instanceof Error ? err.message : "Failed to load orders";
// // // //       setError(message);
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   const applyFilters = () => {
// // // //     let filtered = [...orders];

// // // //     // Status filter
// // // //     if (statusFilter !== "ALL") {
// // // //       filtered = filtered.filter(order => order.paymentStatus === statusFilter);
// // // //     }

// // // //     // Date filter
// // // //     if (dateFilter !== "ALL") {
// // // //       const now = new Date();
// // // //       filtered = filtered.filter(order => {
// // // //         const orderDate = new Date(order.createdAt);
// // // //         const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
// // // //         switch (dateFilter) {
// // // //           case "7DAYS":
// // // //             return daysDiff <= 7;
// // // //           case "30DAYS":
// // // //             return daysDiff <= 30;
// // // //           case "90DAYS":
// // // //             return daysDiff <= 90;
// // // //           default:
// // // //             return true;
// // // //         }
// // // //       });
// // // //     }

// // // //     setFilteredOrders(filtered);
// // // //   };

// // // //   const getStatusBadge = (status: string) => {
// // // //     switch (status) {
// // // //       case "PENDING":
// // // //         return (
// // // //           <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
// // // //             <Clock size={16} />
// // // //             Pending
// // // //           </div>
// // // //         );
// // // //       case "PAID":
// // // //         return (
// // // //           <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
// // // //             <CheckCircle size={16} />
// // // //             Paid
// // // //           </div>
// // // //         );
// // // //       case "VERIFIED":
// // // //         return (
// // // //           <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
// // // //             <CheckCircle size={16} />
// // // //             Verified
// // // //           </div>
// // // //         );
// // // //       default:
// // // //         return (
// // // //           <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
// // // //             Unknown
// // // //           </div>
// // // //         );
// // // //     }
// // // //   };

// // // //   const handleMessageSeller = async (order: any) => {
// // // //     try {
// // // //       setChatLoadingOrderId(order.id);
// // // //       const conversation = await startConversation({
// // // //         productId: order.product.id,
// // // //         sellerId: order.product.seller.id,
// // // //         orderId: order.id,
// // // //       });

// // // //       router.push(`/modules/uni-mart/messages/${conversation.id}`);
// // // //     } catch (err) {
// // // //       console.error("Failed to open seller chat:", err);
// // // //       alert(err instanceof Error ? err.message : "Failed to open chat");
// // // //     } finally {
// // // //       setChatLoadingOrderId(null);
// // // //     }
// // // //   };

// // // //   const getPaymentMethodBadge = (method: string) => {
// // // //     return (
// // // //       <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
// // // //         method === "BANK"
// // // //           ? "bg-blue-100 text-blue-700"
// // // //           : "bg-purple-100 text-purple-700"
// // // //       }`}>
// // // //         {method === "BANK" ? "Bank Transfer" : "Card Payment"}
// // // //       </span>
// // // //     );
// // // //   };

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="flex items-center justify-center h-96">
// // // //         <p className="text-gray-500">Loading order history...</p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="max-w-6xl mx-auto">
// // // //       <button
// // // //         onClick={() => router.back()}
// // // //         className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
// // // //       >
// // // //         <ArrowLeft size={20} />
// // // //         Back
// // // //       </button>

// // // //       <div className="flex justify-between items-center mb-8">
// // // //         <h1 className="text-3xl font-bold text-gray-900">My Purchase History</h1>
// // // //         <div className="flex items-center gap-2 text-gray-600">
// // // //           <Filter size={20} />
// // // //           <span className="font-medium">{filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
// // // //         </div>
// // // //       </div>

// // // //       {error && (
// // // //         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
// // // //           <div className="flex gap-3 text-red-700">
// // // //             <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
// // // //             <div>
// // // //               <p className="font-semibold">Failed to Load Orders</p>
// // // //               <p className="text-sm mt-1">{error}</p>
// // // //               <p className="text-xs mt-2 text-red-600">Check browser console (F12) for detailed logs</p>
// // // //               <button
// // // //                 onClick={() => {
// // // //                   setError(null);
// // // //                   loadOrders();
// // // //                 }}
// // // //                 className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
// // // //               >
// // // //                 Retry
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Filters */}
// // // //       {orders.length > 0 && (
// // // //         <div className="bg-white rounded-lg shadow-md p-4 mb-6">
// // // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //             {/* Status Filter */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Payment Status
// // // //               </label>
// // // //               <select
// // // //                 value={statusFilter}
// // // //                 onChange={(e) => setStatusFilter(e.target.value)}
// // // //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //               >
// // // //                 <option value="ALL">All Statuses</option>
// // // //                 <option value="PENDING">Pending</option>
// // // //                 <option value="VERIFIED">Verified</option>
// // // //               </select>
// // // //             </div>

// // // //             {/* Date Filter */}
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Date Range
// // // //               </label>
// // // //               <select
// // // //                 value={dateFilter}
// // // //                 onChange={(e) => setDateFilter(e.target.value)}
// // // //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// // // //               >
// // // //                 <option value="ALL">All Time</option>
// // // //                 <option value="7DAYS">Last 7 Days</option>
// // // //                 <option value="30DAYS">Last 30 Days</option>
// // // //                 <option value="90DAYS">Last 90 Days</option>
// // // //               </select>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {filteredOrders.length === 0 && orders.length === 0 ? (
// // // //         <div className="text-center py-12 bg-white rounded-lg shadow-md">
// // // //           <XCircle size={48} className="mx-auto text-gray-400 mb-4" />
// // // //           <p className="text-gray-600 text-lg font-medium">No purchases yet</p>
// // // //           <p className="text-gray-500 text-sm mt-2">
// // // //             Start browsing and buy items from Uni-Mart
// // // //           </p>
// // // //           <button
// // // //             onClick={() => router.push("/modules/uni-mart")}
// // // //             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
// // // //           >
// // // //             Browse Products
// // // //           </button>
// // // //         </div>
// // // //       ) : filteredOrders.length === 0 ? (
// // // //         <div className="text-center py-12 bg-white rounded-lg shadow-md">
// // // //           <Filter size={48} className="mx-auto text-gray-400 mb-4" />
// // // //           <p className="text-gray-600 text-lg font-medium">No orders match your filters</p>
// // // //           <p className="text-gray-500 text-sm mt-2">
// // // //             Try adjusting the filters to see more results
// // // //           </p>
// // // //           <button
// // // //             onClick={() => {
// // // //               setStatusFilter("ALL");
// // // //               setDateFilter("ALL");
// // // //             }}
// // // //             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
// // // //           >
// // // //             Clear Filters
// // // //           </button>
// // // //         </div>
// // // //       ) : (
// // // //         <div className="space-y-4">
// // // //           {filteredOrders.map((order) => (
// // // //             <div
// // // //               key={order.id}
// // // //               className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
// // // //             >
// // // //               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
// // // //                 {/* Product Image */}
// // // //                 <div className="md:col-span-1">
// // // //                   <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
// // // //                     {order.product.images[0] && (
// // // //                       <img
// // // //                         src={order.product.images[0]}
// // // //                         alt={order.product.title}
// // // //                         className="w-full h-full object-cover"
// // // //                       />
// // // //                     )}
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Product Details */}
// // // //                 <div className="md:col-span-2 space-y-2">
// // // //                   <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
// // // //                     {order.product.title}
// // // //                   </h3>
// // // //                   <p className="text-2xl font-bold text-blue-600">
// // // //                     Rs. {order.product.price.toLocaleString()}
// // // //                   </p>
// // // //                   <div className="flex gap-2 flex-wrap">
// // // //                     {getPaymentMethodBadge(order.paymentMethod)}
// // // //                     {getStatusBadge(order.paymentStatus)}
// // // //                   </div>
// // // //                   <div className="mt-3 pt-2 border-t border-gray-200">
// // // //                     <p className="text-xs text-gray-500 font-medium mb-1">Seller</p>
// // // //                     <p className="text-sm text-gray-700 font-semibold">{order.product.seller?.name || "Unknown Seller"}</p>
// // // //                     <p className="text-xs text-gray-500">{order.product.seller?.email || "-"}</p>
// // // //                   </div>
// // // //                   <p className="text-xs text-gray-500 mt-2">
// // // //                     Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
// // // //                   </p>
// // // //                 </div>

// // // //                 {/* Actions */}
// // // //                 <div className="md:col-span-1 flex flex-col gap-2">
// // // //                   <button
// // // //                     onClick={() =>
// // // //                       router.push(
// // // //                         `/modules/uni-mart/orders/${order.id}`
// // // //                       )
// // // //                     }
// // // //                     className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
// // // //                   >
// // // //                     View Details
// // // //                   </button>
// // // //                   <button
// // // //                     onClick={() =>
// // // //                       router.push(
// // // //                         `/modules/uni-mart/products/${order.product.id}`
// // // //                       )
// // // //                     }
// // // //                     className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
// // // //                   >
// // // //                     View Product
// // // //                   </button>
                  
// // // //                   {/* Show Write Review button only for VERIFIED orders */}
// // // //                   {order.paymentStatus === "VERIFIED" && (
// // // //                     <button
// // // //                       onClick={() => setReviewingOrderId(order.id)}
// // // //                       className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm flex items-center justify-center gap-2"
// // // //                     >
// // // //                       <Star size={16} />
// // // //                       Write Review
// // // //                     </button>
// // // //                   )}
                  
// // // //                   <button
// // // //                     onClick={() => handleMessageSeller(order)}
// // // //                     disabled={chatLoadingOrderId === order.id}
// // // //                     className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm disabled:bg-gray-400"
// // // //                   >
// // // //                     {chatLoadingOrderId === order.id ? "Opening Chat..." : "Message Seller"}
// // // //                   </button>
// // // //                 </div>
// // // //               </div>

// // // //               {/* Review Form Modal - Show when reviewing this order */}
// // // //               {reviewingOrderId === order.id && (
// // // //                 <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
// // // //                   <div className="flex justify-between items-center mb-4">
// // // //                     <h3 className="font-bold text-gray-900">Write Your Review</h3>
// // // //                     <button
// // // //                       onClick={() => setReviewingOrderId(null)}
// // // //                       className="text-gray-500 hover:text-gray-700"
// // // //                     >
// // // //                       ✕
// // // //                     </button>
// // // //                   </div>
// // // //                   <ReviewForm
// // // //                     productId={order.product.id}
// // // //                     orderId={order.id}
// // // //                     onReviewSubmitted={() => {
// // // //                       setReviewingOrderId(null);
// // // //                       // Optional: reload orders to reflect review status
// // // //                       loadOrders();
// // // //                     }}
// // // //                   />
// // // //                 </div>
// // // //               )}

// // // //               {/* Order ID */}
// // // //               <div className="mt-4 pt-4 border-t text-xs text-gray-500">
// // // //                 Order ID: {order.id}
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";
// // // import { 
// // //   ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, 
// // //   Filter, Star, MessageSquare, ExternalLink, ChevronRight, Loader2, CreditCard, Building2
// // // } from "lucide-react";
// // // import { getToken } from "@/lib/auth";
// // // import { startConversation } from "../services/message.service";
// // // import { ReviewForm } from "../components/ReviewForm";

// // // interface Order {
// // //   id: string;
// // //   productId: string;
// // //   paymentMethod: "BANK" | "CARD";
// // //   paymentStatus: "PENDING" | "PAID" | "VERIFIED";
// // //   createdAt: string;
// // //   product: {
// // //     id: string;
// // //     title: string;
// // //     price: number;
// // //     images: string[];
// // //     seller: {
// // //       id: string;
// // //       name: string;
// // //       email: string;
// // //     };
// // //   };
// // // }

// // // export default function PurchaseHistoryPage() {
// // //   const router = useRouter();
// // //   const [orders, setOrders] = useState<Order[]>([]);
// // //   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [chatLoadingOrderId, setChatLoadingOrderId] = useState<string | null>(null);
// // //   const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  
// // //   // Filter states
// // //   const [statusFilter, setStatusFilter] = useState<string>("ALL");
// // //   const [dateFilter, setDateFilter] = useState<string>("ALL");

// // //   useEffect(() => {
// // //     loadOrders();
// // //   }, []);

// // //   // Apply filters whenever filter state changes
// // //   useEffect(() => {
// // //     applyFilters();
// // //   }, [orders, statusFilter, dateFilter]);

// // //   const loadOrders = async () => {
// // //     try {
// // //       setIsLoading(true);
// // //       setError(null);
// // //       const token = getToken();

// // //       if (!token) {
// // //         router.push("/login");
// // //         return;
// // //       }

// // //       let response = await fetch("/api/unimart/orders/buyer", {
// // //         headers: {
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //       });

// // //       if (response.status === 404) {
// // //         response = await fetch("/api/uni-mart/orders", {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //         });
// // //       }

// // //       if (!response.ok) {
// // //         const raw = await response.text();
// // //         if (response.status === 401) {
// // //           router.push("/login");
// // //           return;
// // //         }

// // //         let errorData: any = null;
// // //         try {
// // //           errorData = raw ? JSON.parse(raw) : null;
// // //         } catch {
// // //           errorData = null;
// // //         }
// // //         const fallbackMessage = raw?.trim()
// // //           ? raw.slice(0, 200)
// // //           : `${response.status} ${response.statusText}`;

// // //         throw new Error(errorData?.error || `Failed to load orders: ${fallbackMessage}`);
// // //       }

// // //       const data = await response.json();
// // //       setOrders(Array.isArray(data) ? data : data.orders || []);
// // //     } catch (err) {
// // //       const message = err instanceof Error ? err.message : "Failed to load orders";
// // //       setError(message);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const applyFilters = () => {
// // //     let filtered = [...orders];

// // //     if (statusFilter !== "ALL") {
// // //       filtered = filtered.filter(order => order.paymentStatus === statusFilter);
// // //     }

// // //     if (dateFilter !== "ALL") {
// // //       const now = new Date();
// // //       filtered = filtered.filter(order => {
// // //         const orderDate = new Date(order.createdAt);
// // //         const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
// // //         switch (dateFilter) {
// // //           case "7DAYS": return daysDiff <= 7;
// // //           case "30DAYS": return daysDiff <= 30;
// // //           case "90DAYS": return daysDiff <= 90;
// // //           default: return true;
// // //         }
// // //       });
// // //     }

// // //     setFilteredOrders(filtered);
// // //   };

// // //   const getStatusBadge = (status: string) => {
// // //     switch (status) {
// // //       case "PENDING":
// // //         return (
// // //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold tracking-wide">
// // //             <Clock size={14} /> Pending
// // //           </span>
// // //         );
// // //       case "PAID":
// // //         return (
// // //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold tracking-wide">
// // //             <CheckCircle size={14} /> Paid
// // //           </span>
// // //         );
// // //       case "VERIFIED":
// // //         return (
// // //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold tracking-wide">
// // //             <CheckCircle size={14} /> Verified
// // //           </span>
// // //         );
// // //       default:
// // //         return (
// // //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-semibold tracking-wide">
// // //             Unknown
// // //           </span>
// // //         );
// // //     }
// // //   };

// // //   const getPaymentMethodBadge = (method: string) => {
// // //     const isBank = method === "BANK";
// // //     return (
// // //       <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${
// // //         isBank 
// // //           ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
// // //           : "bg-purple-50 text-purple-700 border-purple-200"
// // //       }`}>
// // //         {isBank ? <Building2 size={14} /> : <CreditCard size={14} />}
// // //         {isBank ? "Bank Transfer" : "Card Payment"}
// // //       </span>
// // //     );
// // //   };

// // //   const handleMessageSeller = async (order: any) => {
// // //     try {
// // //       setChatLoadingOrderId(order.id);
// // //       const conversation = await startConversation({
// // //         productId: order.product.id,
// // //         sellerId: order.product.seller.id,
// // //         orderId: order.id,
// // //       });

// // //       router.push(`/modules/uni-mart/messages/${conversation.id}`);
// // //     } catch (err) {
// // //       alert(err instanceof Error ? err.message : "Failed to open chat");
// // //     } finally {
// // //       setChatLoadingOrderId(null);
// // //     }
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
// // //         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
// // //         <p className="text-gray-500 font-medium animate-pulse">Loading your order history...</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="max-w-5xl mx-auto pb-12">
// // //       {/* Header Section */}
// // //       <div className="mb-8">
// // //         <button
// // //           onClick={() => router.back()}
// // //           className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4 w-fit"
// // //         >
// // //           <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
// // //             <ArrowLeft size={16} />
// // //           </div>
// // //           Back to previous
// // //         </button>

// // //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// // //           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchase History</h1>
// // //           <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100">
// // //             <Filter size={16} />
// // //             <span>{filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Error Message */}
// // //       {error && (
// // //         <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
// // //           <div className="flex gap-4 text-red-700">
// // //             <AlertCircle className="w-6 h-6 flex-shrink-0" />
// // //             <div>
// // //               <p className="font-bold text-lg">Failed to Load Orders</p>
// // //               <p className="text-sm mt-1 text-red-600/90">{error}</p>
// // //               <button
// // //                 onClick={() => {
// // //                   setError(null);
// // //                   loadOrders();
// // //                 }}
// // //                 className="mt-4 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
// // //               >
// // //                 Try Again
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Filters */}
// // //       {orders.length > 0 && (
// // //         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-col md:flex-row gap-2">
// // //           <div className="flex-1 flex flex-col sm:flex-row gap-2">
// // //             <div className="relative flex-1">
// // //               <select
// // //                 value={statusFilter}
// // //                 onChange={(e) => setStatusFilter(e.target.value)}
// // //                 className="w-full appearance-none bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl border-none text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
// // //               >
// // //                 <option value="ALL">All Statuses</option>
// // //                 <option value="PENDING">Pending</option>
// // //                 <option value="VERIFIED">Verified</option>
// // //               </select>
// // //               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
// // //             </div>

// // //             <div className="relative flex-1">
// // //               <select
// // //                 value={dateFilter}
// // //                 onChange={(e) => setDateFilter(e.target.value)}
// // //                 className="w-full appearance-none bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl border-none text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
// // //               >
// // //                 <option value="ALL">All Time</option>
// // //                 <option value="7DAYS">Last 7 Days</option>
// // //                 <option value="30DAYS">Last 30 Days</option>
// // //                 <option value="90DAYS">Last 90 Days</option>
// // //               </select>
// // //               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Empty States */}
// // //       {filteredOrders.length === 0 && orders.length === 0 ? (
// // //         <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
// // //           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
// // //             <XCircle className="w-10 h-10 text-gray-400" />
// // //           </div>
// // //           <h3 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h3>
// // //           <p className="text-gray-500 max-w-sm mx-auto mb-8">
// // //             Looks like you haven't bought anything from Uni-Mart yet. Start exploring our collection!
// // //           </p>
// // //           <button
// // //             onClick={() => router.push("/modules/uni-mart")}
// // //             className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm hover:shadow transition-all"
// // //           >
// // //             Browse Products
// // //           </button>
// // //         </div>
// // //       ) : filteredOrders.length === 0 ? (
// // //         <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
// // //           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
// // //             <Filter className="w-10 h-10 text-gray-400" />
// // //           </div>
// // //           <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
// // //           <p className="text-gray-500 max-w-sm mx-auto mb-8">
// // //             We couldn't find any orders matching your current filters.
// // //           </p>
// // //           <button
// // //             onClick={() => {
// // //               setStatusFilter("ALL");
// // //               setDateFilter("ALL");
// // //             }}
// // //             className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold shadow-sm hover:shadow transition-all"
// // //           >
// // //             Clear Filters
// // //           </button>
// // //         </div>
// // //       ) : (
// // //         /* Orders List */
// // //         <div className="space-y-6">
// // //           {filteredOrders.map((order) => (
// // //             <div
// // //               key={order.id}
// // //               className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
// // //             >
// // //               {/* Top Banner: Order ID & Date */}
// // //               <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 text-sm">
// // //                 <span className="text-gray-500 font-medium">Order <span className="text-gray-900">#{order.id.slice(0, 8)}...</span></span>
// // //                 <span className="text-gray-500 flex items-center gap-1.5">
// // //                   <Clock size={14} />
// // //                   {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //                 </span>
// // //               </div>

// // //               <div className="p-6 flex flex-col md:flex-row gap-8">
// // //                 {/* Image */}
// // //                 <div className="w-full md:w-40 h-40 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
// // //                   {order.product.images[0] ? (
// // //                     <img
// // //                       src={order.product.images[0]}
// // //                       alt={order.product.title}
// // //                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
// // //                     />
// // //                   ) : (
// // //                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
// // //                   )}
// // //                 </div>

// // //                 {/* Details */}
// // //                 <div className="flex-1 flex flex-col justify-center min-w-0">
// // //                   <div className="flex flex-wrap gap-2 mb-3">
// // //                     {getStatusBadge(order.paymentStatus)}
// // //                     {getPaymentMethodBadge(order.paymentMethod)}
// // //                   </div>
                  
// // //                   <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
// // //                     {order.product.title}
// // //                   </h3>
                  
// // //                   <p className="text-2xl font-black text-blue-600 mb-4">
// // //                     Rs. {order.product.price.toLocaleString()}
// // //                   </p>

// // //                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-fit">
// // //                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
// // //                       {order.product.seller?.name?.charAt(0).toUpperCase() || "S"}
// // //                     </div>
// // //                     <div>
// // //                       <p className="text-sm font-semibold text-gray-900">{order.product.seller?.name || "Unknown Seller"}</p>
// // //                       <p className="text-xs text-gray-500">{order.product.seller?.email || "No email provided"}</p>
// // //                     </div>
// // //                   </div>
// // //                 </div>

// // //                 {/* Actions */}
// // //                 <div className="w-full md:w-56 shrink-0 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
// // //                   <button
// // //                     onClick={() => router.push(`/modules/uni-mart/orders/${order.id}`)}
// // //                     className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-sm transition-colors shadow-sm"
// // //                   >
// // //                     View Order Details
// // //                   </button>
                  
// // //                   <button
// // //                     onClick={() => router.push(`/modules/uni-mart/products/${order.product.id}`)}
// // //                     className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
// // //                   >
// // //                     Product Page <ExternalLink size={14} />
// // //                   </button>
                  
// // //                   {order.paymentStatus === "VERIFIED" && (
// // //                     <button
// // //                       onClick={() => setReviewingOrderId(order.id)}
// // //                       className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
// // //                     >
// // //                       <Star size={16} className="fill-emerald-700" />
// // //                       Write Review
// // //                     </button>
// // //                   )}
                  
// // //                   <button
// // //                     onClick={() => handleMessageSeller(order)}
// // //                     disabled={chatLoadingOrderId === order.id}
// // //                     className="w-full px-4 py-2.5 bg-gray-50 text-gray-700 border border-transparent rounded-xl hover:bg-gray-100 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// // //                   >
// // //                     {chatLoadingOrderId === order.id ? (
// // //                       <><Loader2 size={16} className="animate-spin" /> Loading...</>
// // //                     ) : (
// // //                       <><MessageSquare size={16} /> Contact Seller</>
// // //                     )}
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               {/* Review Form Expansion */}
// // //               {reviewingOrderId === order.id && (
// // //                 <div className="border-t border-gray-100 bg-emerald-50/30 p-6 animate-in slide-in-from-top-4 fade-in duration-200">
// // //                   <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
// // //                     <div className="flex justify-between items-center mb-6">
// // //                       <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// // //                         <Star className="text-emerald-500 fill-emerald-500" size={20} />
// // //                         Rate & Review
// // //                       </h3>
// // //                       <button
// // //                         onClick={() => setReviewingOrderId(null)}
// // //                         className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
// // //                       >
// // //                         <XCircle size={20} />
// // //                       </button>
// // //                     </div>
// // //                     <ReviewForm
// // //                       productId={order.product.id}
// // //                       orderId={order.id}
// // //                       onReviewSubmitted={() => {
// // //                         setReviewingOrderId(null);
// // //                         loadOrders();
// // //                       }}
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { 
// //   ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, 
// //   Filter, Star, MessageSquare, ExternalLink, ChevronRight, 
// //   Loader2, CreditCard, Building2, Search, Copy, Check
// // } from "lucide-react";
// // import { getToken } from "@/lib/auth";
// // import { startConversation } from "../services/message.service";
// // import { ReviewForm } from "../components/ReviewForm";

// // interface Order {
// //   id: string;
// //   productId: string;
// //   paymentMethod: "BANK" | "CARD";
// //   paymentStatus: "PENDING" | "PAID" | "VERIFIED";
// //   createdAt: string;
// //   product: {
// //     id: string;
// //     title: string;
// //     price: number;
// //     images: string[];
// //     seller: {
// //       id: string;
// //       name: string;
// //       email: string;
// //     };
// //   };
// // }

// // export default function PurchaseHistoryPage() {
// //   const router = useRouter();
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [chatLoadingOrderId, setChatLoadingOrderId] = useState<string | null>(null);
// //   const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
// //   const [copiedId, setCopiedId] = useState<string | null>(null);
  
// //   // Filter states
// //   const [searchTerm, setSearchTerm] = useState<string>("");
// //   const [statusFilter, setStatusFilter] = useState<string>("ALL");
// //   const [dateFilter, setDateFilter] = useState<string>("ALL");

// //   useEffect(() => {
// //     loadOrders();
// //   }, []);

// //   // Apply filters whenever filter state changes
// //   useEffect(() => {
// //     applyFilters();
// //   }, [orders, searchTerm, statusFilter, dateFilter]);

// //   const loadOrders = async () => {
// //     try {
// //       setIsLoading(true);
// //       setError(null);
// //       const token = getToken();

// //       if (!token) {
// //         router.push("/login");
// //         return;
// //       }

// //       let response = await fetch("/api/unimart/orders/buyer", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.status === 404) {
// //         response = await fetch("/api/uni-mart/orders", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //       }

// //       if (!response.ok) {
// //         const raw = await response.text();
// //         if (response.status === 401) {
// //           router.push("/login");
// //           return;
// //         }

// //         let errorData: any = null;
// //         try {
// //           errorData = raw ? JSON.parse(raw) : null;
// //         } catch {
// //           errorData = null;
// //         }
// //         const fallbackMessage = raw?.trim()
// //           ? raw.slice(0, 200)
// //           : `${response.status} ${response.statusText}`;

// //         throw new Error(errorData?.error || `Failed to load orders: ${fallbackMessage}`);
// //       }

// //       const data = await response.json();
// //       setOrders(Array.isArray(data) ? data : data.orders || []);
// //     } catch (err) {
// //       const message = err instanceof Error ? err.message : "Failed to load orders";
// //       setError(message);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const applyFilters = () => {
// //     let filtered = [...orders];

// //     // Search filter
// //     if (searchTerm.trim() !== "") {
// //       const lowerQuery = searchTerm.toLowerCase();
// //       filtered = filtered.filter(order => 
// //         order.id.toLowerCase().includes(lowerQuery) || 
// //         order.product.title.toLowerCase().includes(lowerQuery)
// //       );
// //     }

// //     // Status filter
// //     if (statusFilter !== "ALL") {
// //       filtered = filtered.filter(order => order.paymentStatus === statusFilter);
// //     }

// //     // Date filter
// //     if (dateFilter !== "ALL") {
// //       const now = new Date();
// //       filtered = filtered.filter(order => {
// //         const orderDate = new Date(order.createdAt);
// //         const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
// //         switch (dateFilter) {
// //           case "7DAYS": return daysDiff <= 7;
// //           case "30DAYS": return daysDiff <= 30;
// //           case "90DAYS": return daysDiff <= 90;
// //           default: return true;
// //         }
// //       });
// //     }

// //     setFilteredOrders(filtered);
// //   };

// //   const handleCopyOrderId = (id: string) => {
// //     navigator.clipboard.writeText(id);
// //     setCopiedId(id);
// //     setTimeout(() => {
// //       setCopiedId(null);
// //     }, 2000);
// //   };

// //   const getStatusBadge = (status: string) => {
// //     switch (status) {
// //       case "PENDING":
// //         return (
// //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold tracking-wide">
// //             <Clock size={14} /> Pending
// //           </span>
// //         );
// //       case "PAID":
// //         return (
// //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold tracking-wide">
// //             <CheckCircle size={14} /> Paid
// //           </span>
// //         );
// //       case "VERIFIED":
// //         return (
// //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold tracking-wide">
// //             <CheckCircle size={14} /> Verified
// //           </span>
// //         );
// //       default:
// //         return (
// //           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-semibold tracking-wide">
// //             Unknown
// //           </span>
// //         );
// //     }
// //   };

// //   const getPaymentMethodBadge = (method: string) => {
// //     const isBank = method === "BANK";
// //     return (
// //       <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${
// //         isBank 
// //           ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
// //           : "bg-purple-50 text-purple-700 border-purple-200"
// //       }`}>
// //         {isBank ? <Building2 size={14} /> : <CreditCard size={14} />}
// //         {isBank ? "Bank Transfer" : "Card Payment"}
// //       </span>
// //     );
// //   };

// //   const handleMessageSeller = async (order: any) => {
// //     try {
// //       setChatLoadingOrderId(order.id);
// //       const conversation = await startConversation({
// //         productId: order.product.id,
// //         sellerId: order.product.seller.id,
// //         orderId: order.id,
// //       });

// //       router.push(`/modules/uni-mart/messages/${conversation.id}`);
// //     } catch (err) {
// //       alert(err instanceof Error ? err.message : "Failed to open chat");
// //     } finally {
// //       setChatLoadingOrderId(null);
// //     }
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
// //         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
// //         <p className="text-gray-500 font-medium animate-pulse">Loading your order history...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-5xl mx-auto pb-12">
// //       {/* Header Section */}
// //       <div className="mb-8">
// //         <button
// //           onClick={() => router.back()}
// //           className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4 w-fit"
// //         >
// //           <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
// //             <ArrowLeft size={16} />
// //           </div>
// //           Back to previous
// //         </button>

// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchase History</h1>
// //           <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100">
// //             <Filter size={16} />
// //             <span>{filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Error Message */}
// //       {error && (
// //         <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
// //           <div className="flex gap-4 text-red-700">
// //             <AlertCircle className="w-6 h-6 flex-shrink-0" />
// //             <div>
// //               <p className="font-bold text-lg">Failed to Load Orders</p>
// //               <p className="text-sm mt-1 text-red-600/90">{error}</p>
// //               <button
// //                 onClick={() => {
// //                   setError(null);
// //                   loadOrders();
// //                 }}
// //                 className="mt-4 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
// //               >
// //                 Try Again
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Filters & Search */}
// //       {orders.length > 0 && (
// //         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-8">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //             {/* Search Input */}
// //             <div className="relative">
// //               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                 <Search className="h-5 w-5 text-gray-400" />
// //               </div>
// //               <input
// //                 type="text"
// //                 placeholder="Search by Product or Order ID..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-3 bg-gray-50 hover:bg-gray-100 focus:bg-white border-none rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 transition-colors"
// //               />
// //             </div>

// //             {/* Status Filter */}
// //             <div className="relative">
// //               <select
// //                 value={statusFilter}
// //                 onChange={(e) => setStatusFilter(e.target.value)}
// //                 className="w-full appearance-none bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl border-none text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
// //               >
// //                 <option value="ALL">All Statuses</option>
// //                 <option value="PENDING">Pending</option>
// //                 <option value="VERIFIED">Verified</option>
// //               </select>
// //               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
// //             </div>

// //             {/* Date Filter */}
// //             <div className="relative">
// //               <select
// //                 value={dateFilter}
// //                 onChange={(e) => setDateFilter(e.target.value)}
// //                 className="w-full appearance-none bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl border-none text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
// //               >
// //                 <option value="ALL">All Time</option>
// //                 <option value="7DAYS">Last 7 Days</option>
// //                 <option value="30DAYS">Last 30 Days</option>
// //                 <option value="90DAYS">Last 90 Days</option>
// //               </select>
// //               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Empty States */}
// //       {filteredOrders.length === 0 && orders.length === 0 ? (
// //         <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
// //           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
// //             <XCircle className="w-10 h-10 text-gray-400" />
// //           </div>
// //           <h3 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h3>
// //           <p className="text-gray-500 max-w-sm mx-auto mb-8">
// //             Looks like you haven't bought anything from Uni-Mart yet. Start exploring our collection!
// //           </p>
// //           <button
// //             onClick={() => router.push("/modules/uni-mart")}
// //             className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm hover:shadow transition-all"
// //           >
// //             Browse Products
// //           </button>
// //         </div>
// //       ) : filteredOrders.length === 0 ? (
// //         <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
// //           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
// //             <Filter className="w-10 h-10 text-gray-400" />
// //           </div>
// //           <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
// //           <p className="text-gray-500 max-w-sm mx-auto mb-8">
// //             We couldn't find any orders matching your current search or filters.
// //           </p>
// //           <button
// //             onClick={() => {
// //               setSearchTerm("");
// //               setStatusFilter("ALL");
// //               setDateFilter("ALL");
// //             }}
// //             className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold shadow-sm hover:shadow transition-all"
// //           >
// //             Clear Filters & Search
// //           </button>
// //         </div>
// //       ) : (
// //         /* Orders List */
// //         <div className="space-y-6">
// //           {filteredOrders.map((order) => (
// //             <div
// //               key={order.id}
// //               className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
// //             >
// //               {/* Top Banner: Order ID & Date */}
// //               <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 text-sm">
// //                 <div className="flex items-center gap-2">
// //                   <span className="text-gray-500 font-medium">Order <span className="text-gray-900">#{order.id.slice(0, 8)}...</span></span>
// //                   <button 
// //                     onClick={() => handleCopyOrderId(order.id)}
// //                     className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
// //                     title="Copy Full Order ID"
// //                   >
// //                     {copiedId === order.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
// //                   </button>
// //                 </div>
// //                 <span className="text-gray-500 flex items-center gap-1.5">
// //                   <Clock size={14} />
// //                   {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //                 </span>
// //               </div>

// //               <div className="p-6 flex flex-col md:flex-row gap-8">
// //                 {/* Image */}
// //                 <div className="w-full md:w-40 h-40 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
// //                   {order.product.images[0] ? (
// //                     <img
// //                       src={order.product.images[0]}
// //                       alt={order.product.title}
// //                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
// //                     />
// //                   ) : (
// //                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
// //                   )}
// //                 </div>

// //                 {/* Details */}
// //                 <div className="flex-1 flex flex-col justify-center min-w-0">
// //                   <div className="flex flex-wrap gap-2 mb-3">
// //                     {getStatusBadge(order.paymentStatus)}
// //                     {getPaymentMethodBadge(order.paymentMethod)}
// //                   </div>
                  
// //                   <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
// //                     {order.product.title}
// //                   </h3>
                  
// //                   <p className="text-2xl font-black text-blue-600 mb-4">
// //                     Rs. {order.product.price.toLocaleString()}
// //                   </p>

// //                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-fit">
// //                     <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
// //                       {order.product.seller?.name?.charAt(0).toUpperCase() || "S"}
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-semibold text-gray-900">{order.product.seller?.name || "Unknown Seller"}</p>
// //                       <p className="text-xs text-gray-500">{order.product.seller?.email || "No email provided"}</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Actions */}
// //                 <div className="w-full md:w-56 shrink-0 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
// //                   <button
// //                     onClick={() => router.push(`/modules/uni-mart/orders/${order.id}`)}
// //                     className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-sm transition-colors shadow-sm"
// //                   >
// //                     View Order Details
// //                   </button>
                  
// //                   <button
// //                     onClick={() => router.push(`/modules/uni-mart/products/${order.product.id}`)}
// //                     className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
// //                   >
// //                     Product Page <ExternalLink size={14} />
// //                   </button>
                  
// //                   {order.paymentStatus === "VERIFIED" && (
// //                     <button
// //                       onClick={() => setReviewingOrderId(order.id)}
// //                       className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
// //                     >
// //                       <Star size={16} className="fill-emerald-700" />
// //                       Write Review
// //                     </button>
// //                   )}
                  
// //                   <button
// //                     onClick={() => handleMessageSeller(order)}
// //                     disabled={chatLoadingOrderId === order.id}
// //                     className="w-full px-4 py-2.5 bg-gray-50 text-gray-700 border border-transparent rounded-xl hover:bg-gray-100 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //                   >
// //                     {chatLoadingOrderId === order.id ? (
// //                       <><Loader2 size={16} className="animate-spin" /> Loading...</>
// //                     ) : (
// //                       <><MessageSquare size={16} /> Contact Seller</>
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Review Form Expansion */}
// //               {reviewingOrderId === order.id && (
// //                 <div className="border-t border-gray-100 bg-emerald-50/30 p-6 animate-in slide-in-from-top-4 fade-in duration-200">
// //                   <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
// //                     <div className="flex justify-between items-center mb-6">
// //                       <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// //                         <Star className="text-emerald-500 fill-emerald-500" size={20} />
// //                         Rate & Review
// //                       </h3>
// //                       <button
// //                         onClick={() => setReviewingOrderId(null)}
// //                         className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
// //                       >
// //                         <XCircle size={20} />
// //                       </button>
// //                     </div>
// //                     <ReviewForm
// //                       productId={order.product.id}
// //                       orderId={order.id}
// //                       onReviewSubmitted={() => {
// //                         setReviewingOrderId(null);
// //                         loadOrders();
// //                       }}
// //                     />
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }




// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Oxanium } from "next/font/google";
// import { 
//   ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, 
//   Filter, Star, MessageSquare, ExternalLink, ChevronDown, 
//   Loader2, CreditCard, Building2, Search, Copy, Check
// } from "lucide-react";
// import { getToken } from "@/lib/auth";
// import { startConversation } from "../services/message.service";
// import { ReviewForm } from "../components/ReviewForm";

// // Initialize Oxanium font
// const oxanium = Oxanium({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"] 
// });

// interface Order {
//   id: string;
//   productId: string;
//   paymentMethod: "BANK" | "CARD";
//   paymentStatus: "PENDING" | "PAID" | "VERIFIED";
//   createdAt: string;
//   product: {
//     id: string;
//     title: string;
//     price: number;
//     images: string[];
//     seller: {
//       id: string;
//       name: string;
//       email: string;
//     };
//   };
// }

// export default function PurchaseHistoryPage() {
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chatLoadingOrderId, setChatLoadingOrderId] = useState<string | null>(null);
//   const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
//   const [copiedId, setCopiedId] = useState<string | null>(null);
  
//   // Filter states
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<string>("ALL");
//   const [dateFilter, setDateFilter] = useState<string>("ALL");

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   // Apply filters whenever filter state changes
//   useEffect(() => {
//     applyFilters();
//   }, [orders, searchTerm, statusFilter, dateFilter]);

//   const loadOrders = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       let response = await fetch("/api/unimart/orders/buyer", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 404) {
//         response = await fetch("/api/uni-mart/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }

//       if (!response.ok) {
//         const raw = await response.text();
//         if (response.status === 401) {
//           router.push("/login");
//           return;
//         }

//         let errorData: any = null;
//         try {
//           errorData = raw ? JSON.parse(raw) : null;
//         } catch {
//           errorData = null;
//         }
//         const fallbackMessage = raw?.trim()
//           ? raw.slice(0, 200)
//           : `${response.status} ${response.statusText}`;

//         throw new Error(errorData?.error || `Failed to load orders: ${fallbackMessage}`);
//       }

//       const data = await response.json();
//       setOrders(Array.isArray(data) ? data : data.orders || []);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to load orders";
//       setError(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...orders];

//     // Search filter
//     if (searchTerm.trim() !== "") {
//       const lowerQuery = searchTerm.toLowerCase();
//       filtered = filtered.filter(order => 
//         order.id.toLowerCase().includes(lowerQuery) || 
//         order.product.title.toLowerCase().includes(lowerQuery)
//       );
//     }

//     // Status filter
//     if (statusFilter !== "ALL") {
//       filtered = filtered.filter(order => order.paymentStatus === statusFilter);
//     }

//     // Date filter
//     if (dateFilter !== "ALL") {
//       const now = new Date();
//       filtered = filtered.filter(order => {
//         const orderDate = new Date(order.createdAt);
//         const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
//         switch (dateFilter) {
//           case "7DAYS": return daysDiff <= 7;
//           case "30DAYS": return daysDiff <= 30;
//           case "90DAYS": return daysDiff <= 90;
//           default: return true;
//         }
//       });
//     }

//     setFilteredOrders(filtered);
//   };

//   const handleCopyOrderId = (id: string) => {
//     navigator.clipboard.writeText(id);
//     setCopiedId(id);
//     setTimeout(() => {
//       setCopiedId(null);
//     }, 2000);
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return (
//           <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-semibold tracking-wide">
//             <Clock size={16} /> Pending
//           </span>
//         );
//       case "PAID":
//         return (
//           <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-semibold tracking-wide">
//             <CheckCircle size={16} /> Paid
//           </span>
//         );
//       case "VERIFIED":
//         return (
//           <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold tracking-wide">
//             <CheckCircle size={16} /> Verified
//           </span>
//         );
//       default:
//         return (
//           <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm font-semibold tracking-wide">
//             <AlertCircle size={16} /> Unknown
//           </span>
//         );
//     }
//   };

//   const getPaymentMethodBadge = (method: string) => {
//     const isBank = method === "BANK";
//     return (
//       <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide border ${
//         isBank 
//           ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
//           : "bg-violet-50 text-violet-700 border-violet-200"
//       }`}>
//         {isBank ? <Building2 size={16} /> : <CreditCard size={16} />}
//         {isBank ? "Bank Transfer" : "Card Payment"}
//       </span>
//     );
//   };

//   const handleMessageSeller = async (order: any) => {
//     try {
//       setChatLoadingOrderId(order.id);
//       const conversation = await startConversation({
//         productId: order.product.id,
//         sellerId: order.product.seller.id,
//         orderId: order.id,
//       });

//       router.push(`/modules/uni-mart/messages/${conversation.id}`);
//     } catch (err) {
//       alert(err instanceof Error ? err.message : "Failed to open chat");
//     } finally {
//       setChatLoadingOrderId(null);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 ${oxanium.className}`}>
//         <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//         <p className="text-gray-500 font-medium animate-pulse">Loading your order history...</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`max-w-5xl mx-auto pb-12 ${oxanium.className}`}>
//       {/* Header Section */}
//       <div className="mb-8">
//         <button
//           onClick={() => router.back()}
//           className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4 w-fit"
//         >
//           <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
//             <ArrowLeft size={16} />
//           </div>
//           Back to previous
//         </button>

//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchase History</h1>
//           <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100">
//             <Filter size={16} />
//             <span>{filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
//           <div className="flex gap-4 text-red-700">
//             <AlertCircle className="w-6 h-6 flex-shrink-0" />
//             <div>
//               <p className="font-bold text-lg">Failed to Load Orders</p>
//               <p className="text-sm mt-1 text-red-600/90">{error}</p>
//               <button
//                 onClick={() => {
//                   setError(null);
//                   loadOrders();
//                 }}
//                 className="mt-4 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters & Search */}
//       {orders.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Search Input */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Search className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by Product or Order ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="relative">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full appearance-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
//               >
//                 <option value="ALL">All Statuses</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="VERIFIED">Verified</option>
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>

//             {/* Date Filter */}
//             <div className="relative">
//               <select
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="w-full appearance-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
//               >
//                 <option value="ALL">All Time</option>
//                 <option value="7DAYS">Last 7 Days</option>
//                 <option value="30DAYS">Last 30 Days</option>
//                 <option value="90DAYS">Last 90 Days</option>
//               </select>
//               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Empty States */}
//       {filteredOrders.length === 0 && orders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
//           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
//             <XCircle className="w-10 h-10 text-gray-400" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h3>
//           <p className="text-gray-500 max-w-sm mx-auto mb-8">
//             Looks like you haven't bought anything from Uni-Mart yet. Start exploring our collection!
//           </p>
//           <button
//             onClick={() => router.push("/modules/uni-mart")}
//             className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm hover:shadow transition-all"
//           >
//             Browse Products
//           </button>
//         </div>
//       ) : filteredOrders.length === 0 ? (
//         <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
//           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Filter className="w-10 h-10 text-gray-400" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
//           <p className="text-gray-500 max-w-sm mx-auto mb-8">
//             We couldn't find any orders matching your current search or filters.
//           </p>
//           <button
//             onClick={() => {
//               setSearchTerm("");
//               setStatusFilter("ALL");
//               setDateFilter("ALL");
//             }}
//             className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold shadow-sm hover:shadow transition-all"
//           >
//             Clear Filters & Search
//           </button>
//         </div>
//       ) : (
//         /* Orders List */
//         <div className="space-y-6">
//           {filteredOrders.map((order) => (
//             <div
//               key={order.id}
//               className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
//             >
//               {/* Top Banner: Order ID & Date */}
//               <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 text-sm">
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-500 font-medium">Order <span className="text-gray-900">#{order.id.slice(0, 8)}...</span></span>
//                   <button 
//                     onClick={() => handleCopyOrderId(order.id)}
//                     className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                     title="Copy Full Order ID"
//                   >
//                     {copiedId === order.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
//                   </button>
//                 </div>
//                 <span className="text-gray-500 flex items-center gap-1.5">
//                   <Clock size={16} />
//                   {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </div>

//               <div className="p-6 flex flex-col md:flex-row gap-8">
//                 {/* Image */}
//                 <div className="w-full md:w-40 h-40 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
//                   {order.product.images[0] ? (
//                     <img
//                       src={order.product.images[0]}
//                       alt={order.product.title}
//                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
//                   )}
//                 </div>

//                 {/* Details */}
//                 <div className="flex-1 flex flex-col justify-center min-w-0">
//                   <div className="flex flex-wrap gap-3 mb-4">
//                     {getStatusBadge(order.paymentStatus)}
//                     {getPaymentMethodBadge(order.paymentMethod)}
//                   </div>
                  
//                   <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
//                     {order.product.title}
//                   </h3>
                  
//                   <p className="text-2xl font-black text-blue-600 mb-5">
//                     Rs. {order.product.price.toLocaleString()}
//                   </p>

//                   <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl w-fit">
//                     <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
//                       {order.product.seller?.name?.charAt(0).toUpperCase() || "S"}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{order.product.seller?.name || "Unknown Seller"}</p>
//                       <p className="text-xs text-gray-500">{order.product.seller?.email || "No email provided"}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="w-full md:w-56 shrink-0 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
//                   <button
//                     onClick={() => router.push(`/modules/uni-mart/orders/${order.id}`)}
//                     className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-sm transition-colors shadow-sm"
//                   >
//                     View Order Details
//                   </button>
                  
//                   <button
//                     onClick={() => router.push(`/modules/uni-mart/products/${order.product.id}`)}
//                     className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
//                   >
//                     Product Page <ExternalLink size={16} />
//                   </button>
                  
//                   {order.paymentStatus === "VERIFIED" && (
//                     <button
//                       onClick={() => setReviewingOrderId(order.id)}
//                       className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Star size={16} className="fill-emerald-700" />
//                       Write Review
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={() => handleMessageSeller(order)}
//                     disabled={chatLoadingOrderId === order.id}
//                     className="w-full px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {chatLoadingOrderId === order.id ? (
//                       <><Loader2 size={16} className="animate-spin" /> Loading...</>
//                     ) : (
//                       <><MessageSquare size={16} /> Contact Seller</>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Review Form Expansion */}
//               {reviewingOrderId === order.id && (
//                 <div className="border-t border-gray-100 bg-emerald-50/30 p-6 animate-in slide-in-from-top-4 fade-in duration-200">
//                   <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
//                     <div className="flex justify-between items-center mb-6">
//                       <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                         <Star className="text-emerald-500 fill-emerald-500" size={20} />
//                         Rate & Review
//                       </h3>
//                       <button
//                         onClick={() => setReviewingOrderId(null)}
//                         className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//                       >
//                         <XCircle size={20} />
//                       </button>
//                     </div>
//                     <ReviewForm
//                       productId={order.product.id}
//                       orderId={order.id}
//                       onReviewSubmitted={() => {
//                         setReviewingOrderId(null);
//                         loadOrders();
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }







"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Oxanium } from "next/font/google";
import { 
  ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, 
  Filter, Star, MessageSquare, ExternalLink, ChevronDown, 
  Loader2, CreditCard, Building2, Search, Copy, Check
} from "lucide-react";
import { getToken } from "@/lib/auth";
import { startConversation } from "../services/message.service";
import { ReviewForm } from "../components/ReviewForm";

// Initialize Oxanium font
const oxanium = Oxanium({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"] 
});

// --- Modern Custom Dropdown Component ---
interface Option {
  value: string;
  label: string;
}

interface ModernDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

function ModernDropdown({ value, onChange, options }: ModernDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || options[0].label;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm font-medium focus:outline-none transition-all cursor-pointer ${
          isOpen 
            ? "bg-white border-blue-500 ring-4 ring-blue-500/10 text-gray-900" 
            : "bg-gray-50/50 hover:bg-gray-50 border-gray-200 text-gray-700"
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                value === option.value
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
              }`}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && <Check size={16} className="text-blue-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ----------------------------------------

interface Order {
  id: string;
  productId: string;
  paymentMethod: "BANK" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "VERIFIED";
  createdAt: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    seller: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatLoadingOrderId, setChatLoadingOrderId] = useState<string | null>(null);
  const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  useEffect(() => {
    loadOrders();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      let response = await fetch("/api/unimart/orders/buyer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        response = await fetch("/api/uni-mart/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (!response.ok) {
        const raw = await response.text();
        if (response.status === 401) {
          router.push("/login");
          return;
        }

        let errorData: any = null;
        try {
          errorData = raw ? JSON.parse(raw) : null;
        } catch {
          errorData = null;
        }
        const fallbackMessage = raw?.trim()
          ? raw.slice(0, 200)
          : `${response.status} ${response.statusText}`;

        throw new Error(errorData?.error || `Failed to load orders: ${fallbackMessage}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm.trim() !== "") {
      const lowerQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(lowerQuery) || 
        order.product.title.toLowerCase().includes(lowerQuery)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(order => order.paymentStatus === statusFilter);
    }

    // Date filter
    if (dateFilter !== "ALL") {
      const now = new Date();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case "7DAYS": return daysDiff <= 7;
          case "30DAYS": return daysDiff <= 30;
          case "90DAYS": return daysDiff <= 90;
          default: return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-semibold tracking-wide shadow-sm">
            <Clock size={16} /> Pending
          </span>
        );
      case "PAID":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm font-semibold tracking-wide shadow-sm">
            <CheckCircle size={16} /> Paid
          </span>
        );
      case "VERIFIED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold tracking-wide shadow-sm">
            <CheckCircle size={16} /> Verified
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm font-semibold tracking-wide shadow-sm">
            <AlertCircle size={16} /> Unknown
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const isBank = method === "BANK";
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide border shadow-sm ${
        isBank 
          ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
          : "bg-violet-50 text-violet-700 border-violet-200"
      }`}>
        {isBank ? <Building2 size={16} /> : <CreditCard size={16} />}
        {isBank ? "Bank Transfer" : "Card Payment"}
      </span>
    );
  };

  const handleMessageSeller = async (order: any) => {
    try {
      setChatLoadingOrderId(order.id);
      const conversation = await startConversation({
        productId: order.product.id,
        sellerId: order.product.seller.id,
        orderId: order.id,
      });

      router.push(`/modules/uni-mart/messages/${conversation.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to open chat");
    } finally {
      setChatLoadingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 ${oxanium.className}`}>
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto pb-12 ${oxanium.className}`}>
      {/* Header Section */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-4 w-fit"
        >
          <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to previous
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Purchase History</h1>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100">
            <Filter size={16} />
            <span>{filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex gap-4 text-red-700">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Failed to Load Orders</p>
              <p className="text-sm mt-1 text-red-600/90">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  loadOrders();
                }}
                className="mt-4 px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Product or Order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <ModernDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "ALL", label: "All Statuses" },
                { value: "PENDING", label: "Pending" },
                { value: "VERIFIED", label: "Verified" }
              ]}
            />

            {/* Date Filter */}
            <ModernDropdown
              value={dateFilter}
              onChange={setDateFilter}
              options={[
                { value: "ALL", label: "All Time" },
                { value: "7DAYS", label: "Last 7 Days" },
                { value: "30DAYS", label: "Last 30 Days" },
                { value: "90DAYS", label: "Last 90 Days" }
              ]}
            />
          </div>
        </div>
      )}

      {/* Empty States */}
      {filteredOrders.length === 0 && orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Looks like you haven't bought anything from Uni-Mart yet. Start exploring our collection!
          </p>
          <button
            onClick={() => router.push("/modules/uni-mart")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm hover:shadow transition-all"
          >
            Browse Products
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            We couldn't find any orders matching your current search or filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("ALL");
              setDateFilter("ALL");
            }}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold shadow-sm hover:shadow transition-all"
          >
            Clear Filters & Search
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Top Banner: Order ID & Date */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">Order <span className="text-gray-900 font-semibold">#{order.id.slice(0, 8)}...</span></span>
                  <button 
                    onClick={() => handleCopyOrderId(order.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Copy Full Order ID"
                  >
                    {copiedId === order.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
                <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                  <Clock size={16} />
                  {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="p-6 flex flex-col md:flex-row gap-8">
                {/* Image */}
                <div className="w-full md:w-40 h-40 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  {order.product.images[0] ? (
                    <img
                      src={order.product.images[0]}
                      alt={order.product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {getStatusBadge(order.paymentStatus)}
                    {getPaymentMethodBadge(order.paymentMethod)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                    {order.product.title}
                  </h3>
                  
                  <p className="text-2xl font-black text-blue-600 mb-5">
                    Rs. {order.product.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl w-fit">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                      {order.product.seller?.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.product.seller?.name || "Unknown Seller"}</p>
                      <p className="text-xs font-medium text-gray-500">{order.product.seller?.email || "No email provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-56 shrink-0 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  <button
                    onClick={() => router.push(`/modules/uni-mart/orders/${order.id}`)}
                    className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-sm transition-colors shadow-sm"
                  >
                    View Order Details
                  </button>
                  
                  <button
                    onClick={() => router.push(`/modules/uni-mart/products/${order.product.id}`)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Product Page <ExternalLink size={16} />
                  </button>
                  
                  {order.paymentStatus === "VERIFIED" && (
                    <button
                      onClick={() => setReviewingOrderId(order.id)}
                      className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Star size={16} className="fill-emerald-700" />
                      Write Review
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleMessageSeller(order)}
                    disabled={chatLoadingOrderId === order.id}
                    className="w-full px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    {chatLoadingOrderId === order.id ? (
                      <><Loader2 size={16} className="animate-spin" /> Loading...</>
                    ) : (
                      <><MessageSquare size={16} /> Contact Seller</>
                    )}
                  </button>
                </div>
              </div>

              {/* Review Form Expansion */}
              {reviewingOrderId === order.id && (
                <div className="border-t border-gray-100 bg-emerald-50/30 p-6 animate-in slide-in-from-top-4 fade-in duration-200">
                  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Star className="text-emerald-500 fill-emerald-500" size={20} />
                        Rate & Review
                      </h3>
                      <button
                        onClick={() => setReviewingOrderId(null)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                    <ReviewForm
                      productId={order.product.id}
                      orderId={order.id}
                      onReviewSubmitted={() => {
                        setReviewingOrderId(null);
                        loadOrders();
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}