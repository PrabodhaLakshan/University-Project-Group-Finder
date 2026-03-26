"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, Filter, Star } from "lucide-react";
import { getToken } from "@/lib/auth";
import { startConversation } from "../services/message.service";
import { ReviewForm } from "../components/ReviewForm";

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
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  useEffect(() => {
    loadOrders();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, dateFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear previous errors
      const token = getToken();

      console.log("[Purchase History] Token:", token ? "Present" : "Missing");

      if (!token) {
        console.log("[Purchase History] No token, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("[Purchase History] Fetching orders from API...");
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

      console.log("[Purchase History] Response status:", response.status);

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

        console.error("[Purchase History] Error details:", {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          parsed: errorData,
          raw: raw?.slice(0, 200) || "<empty>",
        });

        throw new Error(errorData?.error || `Failed to load orders: ${fallbackMessage}`);
      }

      const data = await response.json();
      console.log("[Purchase History] Received data:", data);
      console.log("[Purchase History] Orders count:", data.orders?.length || 0);
      
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error("[Purchase History] Load error:", err);
      const message = err instanceof Error ? err.message : "Failed to load orders";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

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
          case "7DAYS":
            return daysDiff <= 7;
          case "30DAYS":
            return daysDiff <= 30;
          case "90DAYS":
            return daysDiff <= 90;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock size={16} />
            Pending
          </div>
        );
      case "PAID":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <CheckCircle size={16} />
            Paid
          </div>
        );
      case "VERIFIED":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle size={16} />
            Verified
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            Unknown
          </div>
        );
    }
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
      console.error("Failed to open seller chat:", err);
      alert(err instanceof Error ? err.message : "Failed to open chat");
    } finally {
      setChatLoadingOrderId(null);
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
        method === "BANK"
          ? "bg-blue-100 text-blue-700"
          : "bg-purple-100 text-purple-700"
      }`}>
        {method === "BANK" ? "Bank Transfer" : "Card Payment"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Purchase History</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={20} />
          <span className="font-medium">{filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3 text-red-700">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to Load Orders</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs mt-2 text-red-600">Check browser console (F12) for detailed logs</p>
              <button
                onClick={() => {
                  setError(null);
                  loadOrders();
                }}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Time</option>
                <option value="7DAYS">Last 7 Days</option>
                <option value="30DAYS">Last 30 Days</option>
                <option value="90DAYS">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <XCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No purchases yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Start browsing and buy items from Uni-Mart
          </p>
          <button
            onClick={() => router.push("/modules/uni-mart")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Browse Products
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No orders match your filters</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting the filters to see more results
          </p>
          <button
            onClick={() => {
              setStatusFilter("ALL");
              setDateFilter("ALL");
            }}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                {/* Product Image */}
                <div className="md:col-span-1">
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {order.product.images[0] && (
                      <img
                        src={order.product.images[0]}
                        alt={order.product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="md:col-span-2 space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {order.product.title}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    Rs. {order.product.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {getPaymentMethodBadge(order.paymentMethod)}
                    {getStatusBadge(order.paymentStatus)}
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Seller</p>
                    <p className="text-sm text-gray-700 font-semibold">{order.product.seller?.name || "Unknown Seller"}</p>
                    <p className="text-xs text-gray-500">{order.product.seller?.email || "-"}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex flex-col gap-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/modules/uni-mart/orders/${order.id}`
                      )
                    }
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        `/modules/uni-mart/products/${order.product.id}`
                      )
                    }
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                  >
                    View Product
                  </button>
                  
                  {/* Show Write Review button only for VERIFIED orders */}
                  {order.paymentStatus === "VERIFIED" && (
                    <button
                      onClick={() => setReviewingOrderId(order.id)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Star size={16} />
                      Write Review
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleMessageSeller(order)}
                    disabled={chatLoadingOrderId === order.id}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm disabled:bg-gray-400"
                  >
                    {chatLoadingOrderId === order.id ? "Opening Chat..." : "Message Seller"}
                  </button>
                </div>
              </div>

              {/* Review Form Modal - Show when reviewing this order */}
              {reviewingOrderId === order.id && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Write Your Review</h3>
                    <button
                      onClick={() => setReviewingOrderId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <ReviewForm
                    productId={order.product.id}
                    orderId={order.id}
                    onReviewSubmitted={() => {
                      setReviewingOrderId(null);
                      // Optional: reload orders to reflect review status
                      loadOrders();
                    }}
                  />
                </div>
              )}

              {/* Order ID */}
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Order ID: {order.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
