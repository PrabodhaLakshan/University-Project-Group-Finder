"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { CheckCircle, Clock, Package, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  currentOrderId?: string;
  images: string[];
  createdAt: string;
}

interface Order {
  id: string;
  paymentMethod: string;
  paymentStatus: string;
  receiptUrl?: string;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    title: string;
    price: number;
  };
}

export default function SellerSalesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch seller's products
      const productsRes = await fetch("/api/unimart/products?seller=me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.items || []);
        
        // Filter products with RESERVED status and get their orders
        const reservedProducts = (data.items || []).filter(
          (p: Product) => p.status === "RESERVED" && p.currentOrderId
        );

        // Fetch order details for reserved products
        if (reservedProducts.length > 0) {
          const orderPromises = reservedProducts.map(async (product: Product) => {
            const orderRes = await fetch(`/api/unimart/orders/${product.currentOrderId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (orderRes.ok) {
              return await orderRes.json();
            }
            return null;
          });

          const orders = (await Promise.all(orderPromises)).filter(Boolean);
          // Only show orders with PENDING payment status
          setPendingOrders(orders.filter((order) => order.paymentStatus === "PENDING"));
        }
      }
    } catch (error) {
      console.error("Failed to load seller data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      setVerifying(orderId);
      
      // Immediately remove from pending to prevent double clicks
      const orderToVerify = pendingOrders.find(o => o.id === orderId);
      if (!orderToVerify) {
        alert("Order not found");
        return;
      }
      
      setPendingOrders(pendingOrders.filter(o => o.id !== orderId));

      const response = await fetch("/api/unimart/orders/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify payment");
      }

      alert("Payment verified! Product marked as sold.");
      // Reload the entire seller data to sync products and orders
      await loadSellerData();
    } catch (error) {
      console.error("Verification error:", error);
      // Reload data on error to restore state
      await loadSellerData();
      alert(error instanceof Error ? error.message : "Failed to verify payment");
    } finally {
      setVerifying(null);
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    const token = getToken();
    if (!token) return;

    const reason = prompt("Enter reason for rejection (optional):");
    if (reason === null) return; // User clicked cancel

    try {
      setRejecting(orderId);
      
      // Immediately remove from pending to prevent double clicks
      const orderToReject = pendingOrders.find(o => o.id === orderId);
      if (!orderToReject) {
        alert("Order not found");
        return;
      }
      
      setPendingOrders(pendingOrders.filter(o => o.id !== orderId));

      const response = await fetch("/api/unimart/orders/reject-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject payment");
      }

      alert("Order rejected. Product is now available again.");
      // Reload the entire seller data to sync products and orders
      await loadSellerData();
    } catch (error) {
      console.error("Rejection error:", error);
      // Reload data on error to restore state
      await loadSellerData();
      alert(error instanceof Error ? error.message : "Failed to reject payment");
    } finally {
      setRejecting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading your sales...</p>
      </div>
    );
  }

  const reservedCount = products.filter((p) => p.status === "RESERVED").length;
  const soldCount = products.filter((p) => p.status === "SOLD").length;
  const availableCount = products.filter((p) => p.status === "AVAILABLE").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
        <p className="text-gray-600 mt-2">Manage your product sales and verify payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package size={32} className="text-gray-400" />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-900">{reservedCount}</p>
            </div>
            <Clock size={32} className="text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Sold</p>
              <p className="text-2xl font-bold text-green-900">{soldCount}</p>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Available</p>
              <p className="text-2xl font-bold text-blue-900">{availableCount}</p>
            </div>
            <AlertCircle size={32} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Pending Payments */}
      {pendingOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Clock className="text-yellow-500" size={28} />
            Pending Payment Verification ({pendingOrders.length})
          </h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-yellow-500 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {order.product.title}
                        </h3>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                          Awaiting Verification
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                        <div>
                          <p className="text-gray-600 text-xs font-medium mb-1">Buyer</p>
                          <p className="font-semibold text-gray-900">{order.buyer?.name || "Unknown Buyer"}</p>
                          <p className="text-gray-500 text-xs">{order.buyer?.email || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs font-medium mb-1">Amount</p>
                          <p className="font-bold text-blue-600 text-lg">
                            Rs. {order.product.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs font-medium mb-1">Payment Method</p>
                          <p className="font-semibold text-gray-900">
                            {order.paymentMethod === "BANK" ? "🏦 Bank Deposit" : "💳 Card Payment"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs font-medium mb-1">Order Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {order.paymentMethod === "BANK" && order.receiptUrl && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-900 text-xs font-semibold mb-2">Payment Receipt Attached</p>
                          <img
                            src={order.receiptUrl}
                            alt="Payment receipt"
                            className="max-w-xs rounded border border-gray-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <button
                        onClick={() => handleVerifyPayment(order.id)}
                        disabled={verifying === order.id || rejecting === order.id}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
                      >
                        {verifying === order.id ? "⏳ Verifying..." : "✓ Verify & Sell"}
                      </button>
                      <button
                        onClick={() => handleRejectPayment(order.id)}
                        disabled={verifying === order.id || rejecting === order.id}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
                      >
                        {rejecting === order.id ? "⏳ Rejecting..." : "✗ Reject"}
                      </button>
                      <button
                        onClick={() => router.push(`/modules/uni-mart/orders/${order.id}`)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingOrders.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <CheckCircle className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 font-medium text-lg">No pending payments</p>
          <p className="text-gray-500 text-sm mt-2">All your orders have been verified!</p>
        </div>
      )}
    </div>
  );
}
