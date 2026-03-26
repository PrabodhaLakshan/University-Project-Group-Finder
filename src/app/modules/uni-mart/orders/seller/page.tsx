"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, Filter, Package } from "lucide-react";
import { getToken } from "@/lib/auth";

interface Order {
  id: string;
  productId: string;
  paymentMethod: "BANK" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "VERIFIED";
  receiptUrl?: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    status: string;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
    student_id: string;
  };
}

export default function SellerHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      setError(null);
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/unimart/orders/seller", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const raw = await response.text();
        let errorData: any = {};
        try {
          errorData = raw ? JSON.parse(raw) : {};
        } catch {
          errorData = { raw };
        }
        throw new Error(errorData.error || `Failed to load orders (${response.status})`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
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
            Verified & Sold
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

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.paymentStatus === "VERIFIED")
      .reduce((sum, order) => sum + Number(order.product.price), 0);
  };

  const getPendingRevenue = () => {
    return filteredOrders
      .filter(order => order.paymentStatus === "PENDING")
      .reduce((sum, order) => sum + Number(order.product.price), 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading sales history...</p>
      </div>
    );
  }

  const verifiedCount = filteredOrders.filter(o => o.paymentStatus === "VERIFIED").length;
  const pendingCount = filteredOrders.filter(o => o.paymentStatus === "PENDING").length;

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
        <h1 className="text-3xl font-bold text-gray-900">Sales History</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Package size={20} />
          <span className="font-medium">{filteredOrders.length} {filteredOrders.length === 1 ? 'Sale' : 'Sales'}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3 text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Stats Cards */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">Verified</p>
            <p className="text-2xl font-bold text-green-900">{verifiedCount}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-900">Rs. {getTotalRevenue().toLocaleString()}</p>
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
          <p className="text-gray-600 text-lg font-medium">No sales yet</p>
          <p className="text-gray-500 text-sm mt-2">
            When customers buy your products, they will appear here
          </p>
          <button
            onClick={() => router.push("/modules/uni-mart")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            View My Products
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Filter size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No sales match your filters</p>
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

                {/* Order Details */}
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
                  
                  {/* Buyer Info */}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">Buyer</p>
                    <p className="text-sm text-gray-700 font-semibold">{order.buyer?.name || "Unknown Buyer"}</p>
                    <p className="text-xs text-gray-500">{order.buyer?.email || "-"}</p>
                    <p className="text-xs text-gray-500">Student ID: {order.buyer?.student_id || "-"}</p>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Sold on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
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
                  
                  {order.paymentMethod === "BANK" && order.receiptUrl && (
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm text-center"
                    >
                      View Receipt
                    </a>
                  )}
                  
                  {order.paymentStatus === "PENDING" && (
                    <button
                      onClick={() => router.push("/modules/uni-mart/sales")}
                      className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-medium text-sm"
                    >
                      Verify Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
