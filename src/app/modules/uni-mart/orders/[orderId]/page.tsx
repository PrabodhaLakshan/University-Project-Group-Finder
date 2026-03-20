"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Download } from "lucide-react";
import { getToken } from "@/lib/auth";
import { startConversation } from "../../services/message.service";

interface OrderDetails {
  id: string;
  paymentMethod: "BANK" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "VERIFIED";
  receiptUrl?: string;
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
  buyer: {
    id: string;
    name: string;
    email: string;
  };
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/unimart/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load order");
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error("Error loading order:", err);
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatWithSeller = async () => {
    if (!order || isStartingChat) return;

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      setIsStartingChat(true);
      const conversation = await startConversation({
        productId: order.product.id,
        sellerId: order.product.seller.id,
        orderId: order.id,
      });

      router.push(`/modules/uni-mart/messages/${conversation.id}`);
    } catch (err) {
      console.error("Failed to open chat:", err);
      alert(err instanceof Error ? err.message : "Failed to open chat");
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700">
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700">
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-white rounded-lg shadow p-8 text-center border-l-4 border-red-500">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
            <p className="text-red-600 font-semibold">{error || "Order not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDING: { icon: Clock, color: "yellow", label: "Payment Pending" },
    VERIFIED: { icon: CheckCircle, color: "green", label: "Verified & Completed" },
    PAID: { icon: CheckCircle, color: "green", label: "Paid" },
  };

  const config = statusConfig[order.paymentStatus];
  const Icon = config.icon;

  const colorClasses = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`border-l-4 p-6 ${
            order.paymentStatus === "VERIFIED" ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-500"
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id.slice(0, 8)}</h1>
                <p className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end">
                <Icon size={40} className={order.paymentStatus === "VERIFIED" ? "text-green-600" : "text-yellow-600"} />
                <span className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  order.paymentStatus === "VERIFIED" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                }`}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.product.images[0] && (
                  <div className="md:col-span-2 lg:col-span-1">
                    <img 
                      src={order.product.images[0]} 
                      alt={order.product.title}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <p className="text-gray-600 text-sm">Product Title</p>
                    <p className="text-lg font-semibold text-gray-900">{order.product.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Price</p>
                    <p className="text-2xl font-bold text-blue-600">Rs. {order.product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Product ID</p>
                    <p className="text-gray-900 font-mono text-sm">{order.product.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer & Seller Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Buyer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="font-semibold text-gray-900">{order.buyer?.name || "Unknown Buyer"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900 break-all">{order.buyer?.email || "-"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Seller Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <p className="text-gray-600 text-sm">Name</p>
                    <p className="font-semibold text-gray-900">{order.product.seller?.name || "Unknown Seller"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900 break-all">{order.product.seller?.email || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.paymentMethod === "BANK" ? "Bank Deposit" : "Card Payment"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <p className={`text-lg font-semibold ${
                    order.paymentStatus === "VERIFIED" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Receipt Image for Bank Payment */}
              {order.paymentMethod === "BANK" && order.receiptUrl && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Download size={18} />
                    Payment Receipt
                  </h4>
                  <img
                    src={order.receiptUrl}
                    alt="Payment receipt"
                    className="max-w-sm rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <div className="w-1 h-12 bg-gray-300"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Created</p>
                    <p className="text-gray-600 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {order.paymentStatus !== "PENDING" && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Payment {order.paymentStatus === "VERIFIED" ? "Verified" : "Processed"}</p>
                      <p className="text-gray-600 text-sm">Payment confirmed and order completed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={handleChatWithSeller}
              disabled={isStartingChat}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400"
            >
              {isStartingChat ? "Opening Chat..." : "Chat with Seller"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
