// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, AlertCircle, Clock, CheckCircle, XCircle, Filter, Package } from "lucide-react";
// import { getToken } from "@/lib/auth";

// interface Order {
//   id: string;
//   productId: string;
//   paymentMethod: "BANK" | "CARD";
//   paymentStatus: "PENDING" | "PAID" | "VERIFIED";
//   receiptUrl?: string;
//   createdAt: string;
//   product: {
//     id: string;
//     title: string;
//     price: number;
//     images: string[];
//     status: string;
//   };
//   buyer: {
//     id: string;
//     name: string;
//     email: string;
//     student_id: string;
//   };
// }

// export default function SellerHistoryPage() {
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Filter states
//   const [statusFilter, setStatusFilter] = useState<string>("ALL");
//   const [dateFilter, setDateFilter] = useState<string>("ALL");

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   // Apply filters whenever filter state changes
//   useEffect(() => {
//     applyFilters();
//   }, [orders, statusFilter, dateFilter]);

//   const loadOrders = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const response = await fetch("/api/unimart/orders/seller", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const raw = await response.text();
//         let errorData: any = {};
//         try {
//           errorData = raw ? JSON.parse(raw) : {};
//         } catch {
//           errorData = { raw };
//         }
//         throw new Error(errorData.error || `Failed to load orders (${response.status})`);
//       }

//       const data = await response.json();
//       setOrders(data.orders || []);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to load orders";
//       setError(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...orders];

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
//           case "7DAYS":
//             return daysDiff <= 7;
//           case "30DAYS":
//             return daysDiff <= 30;
//           case "90DAYS":
//             return daysDiff <= 90;
//           default:
//             return true;
//         }
//       });
//     }

//     setFilteredOrders(filtered);
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return (
//           <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
//             <Clock size={16} />
//             Pending
//           </div>
//         );
//       case "PAID":
//         return (
//           <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//             <CheckCircle size={16} />
//             Paid
//           </div>
//         );
//       case "VERIFIED":
//         return (
//           <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//             <CheckCircle size={16} />
//             Verified & Sold
//           </div>
//         );
//       default:
//         return (
//           <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
//             Unknown
//           </div>
//         );
//     }
//   };

//   const getPaymentMethodBadge = (method: string) => {
//     return (
//       <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
//         method === "BANK"
//           ? "bg-blue-100 text-blue-700"
//           : "bg-purple-100 text-purple-700"
//       }`}>
//         {method === "BANK" ? "Bank Transfer" : "Card Payment"}
//       </span>
//     );
//   };

//   const getTotalRevenue = () => {
//     return filteredOrders
//       .filter(order => order.paymentStatus === "VERIFIED")
//       .reduce((sum, order) => sum + Number(order.product.price), 0);
//   };

//   const getPendingRevenue = () => {
//     return filteredOrders
//       .filter(order => order.paymentStatus === "PENDING")
//       .reduce((sum, order) => sum + Number(order.product.price), 0);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <p className="text-gray-500">Loading sales history...</p>
//       </div>
//     );
//   }

//   const verifiedCount = filteredOrders.filter(o => o.paymentStatus === "VERIFIED").length;
//   const pendingCount = filteredOrders.filter(o => o.paymentStatus === "PENDING").length;

//   return (
//     <div className="max-w-6xl mx-auto">
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
//       >
//         <ArrowLeft size={20} />
//         Back
//       </button>

//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Sales History</h1>
//         <div className="flex items-center gap-2 text-gray-600">
//           <Package size={20} />
//           <span className="font-medium">{filteredOrders.length} {filteredOrders.length === 1 ? 'Sale' : 'Sales'}</span>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3 text-red-700">
//           <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
//           <div>{error}</div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       {orders.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-md p-4">
//             <p className="text-sm text-gray-600">Total Sales</p>
//             <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
//           </div>
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <p className="text-sm text-green-700">Verified</p>
//             <p className="text-2xl font-bold text-green-900">{verifiedCount}</p>
//           </div>
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <p className="text-sm text-yellow-700">Pending</p>
//             <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
//           </div>
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-sm text-blue-700">Total Revenue</p>
//             <p className="text-2xl font-bold text-blue-900">Rs. {getTotalRevenue().toLocaleString()}</p>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       {orders.length > 0 && (
//         <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Status Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Payment Status
//               </label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="ALL">All Statuses</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="VERIFIED">Verified</option>
//               </select>
//             </div>

//             {/* Date Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date Range
//               </label>
//               <select
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="ALL">All Time</option>
//                 <option value="7DAYS">Last 7 Days</option>
//                 <option value="30DAYS">Last 30 Days</option>
//                 <option value="90DAYS">Last 90 Days</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {filteredOrders.length === 0 && orders.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow-md">
//           <XCircle size={48} className="mx-auto text-gray-400 mb-4" />
//           <p className="text-gray-600 text-lg font-medium">No sales yet</p>
//           <p className="text-gray-500 text-sm mt-2">
//             When customers buy your products, they will appear here
//           </p>
//           <button
//             onClick={() => router.push("/modules/uni-mart")}
//             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//           >
//             View My Products
//           </button>
//         </div>
//       ) : filteredOrders.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow-md">
//           <Filter size={48} className="mx-auto text-gray-400 mb-4" />
//           <p className="text-gray-600 text-lg font-medium">No sales match your filters</p>
//           <p className="text-gray-500 text-sm mt-2">
//             Try adjusting the filters to see more results
//           </p>
//           <button
//             onClick={() => {
//               setStatusFilter("ALL");
//               setDateFilter("ALL");
//             }}
//             className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//           >
//             Clear Filters
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredOrders.map((order) => (
//             <div
//               key={order.id}
//               className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
//                 {/* Product Image */}
//                 <div className="md:col-span-1">
//                   <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
//                     {order.product.images[0] && (
//                       <img
//                         src={order.product.images[0]}
//                         alt={order.product.title}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Details */}
//                 <div className="md:col-span-2 space-y-2">
//                   <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
//                     {order.product.title}
//                   </h3>
//                   <p className="text-2xl font-bold text-blue-600">
//                     Rs. {order.product.price.toLocaleString()}
//                   </p>
//                   <div className="flex gap-2 flex-wrap">
//                     {getPaymentMethodBadge(order.paymentMethod)}
//                     {getStatusBadge(order.paymentStatus)}
//                   </div>
                  
//                   {/* Buyer Info */}
//                   <div className="mt-3 pt-2 border-t border-gray-200">
//                     <p className="text-xs text-gray-500 font-medium mb-1">Buyer</p>
//                     <p className="text-sm text-gray-700 font-semibold">{order.buyer?.name || "Unknown Buyer"}</p>
//                     <p className="text-xs text-gray-500">{order.buyer?.email || "-"}</p>
//                     <p className="text-xs text-gray-500">Student ID: {order.buyer?.student_id || "-"}</p>
//                   </div>
                  
//                   <p className="text-xs text-gray-500 mt-2">
//                     Sold on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
//                   </p>
//                 </div>

//                 {/* Actions */}
//                 <div className="md:col-span-1 flex flex-col gap-2">
//                   <button
//                     onClick={() =>
//                       router.push(
//                         `/modules/uni-mart/orders/${order.id}`
//                       )
//                     }
//                     className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
//                   >
//                     View Details
//                   </button>
//                   <button
//                     onClick={() =>
//                       router.push(
//                         `/modules/uni-mart/products/${order.product.id}`
//                       )
//                     }
//                     className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
//                   >
//                     View Product
//                   </button>
                  
//                   {order.paymentMethod === "BANK" && order.receiptUrl && (
//                     <a
//                       href={order.receiptUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm text-center"
//                     >
//                       View Receipt
//                     </a>
//                   )}
                  
//                   {order.paymentStatus === "PENDING" && (
//                     <button
//                       onClick={() => router.push("/modules/uni-mart/sales")}
//                       className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-medium text-sm"
//                     >
//                       Verify Payment
//                     </button>
//                   )}
//                 </div>
//               </div>
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
  Filter, Package, Search, ChevronDown, Copy, Check,
  ExternalLink, FileText, UserSquare2, TrendingUp,
  CreditCard, Building2, LayoutList
} from "lucide-react";
import { getToken } from "@/lib/auth";

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

    // Search filter
    if (searchTerm.trim() !== "") {
      const lowerQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(lowerQuery) || 
        order.product.title.toLowerCase().includes(lowerQuery) ||
        (order.buyer?.name && order.buyer.name.toLowerCase().includes(lowerQuery))
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
            <CheckCircle size={16} /> Verified & Sold
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

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.paymentStatus === "VERIFIED")
      .reduce((sum, order) => sum + Number(order.product.price), 0);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 ${oxanium.className}`}>
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading sales history...</p>
      </div>
    );
  }

  const verifiedCount = filteredOrders.filter(o => o.paymentStatus === "VERIFIED").length;
  const pendingCount = filteredOrders.filter(o => o.paymentStatus === "PENDING").length;

  return (
    <div className={`max-w-6xl mx-auto pb-12 ${oxanium.className}`}>
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sales History</h1>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100">
            <Package size={16} />
            <span>{filteredOrders.length} {filteredOrders.length === 1 ? 'Sale' : 'Sales'}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex gap-4 text-red-700">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Failed to Load Data</p>
              <p className="text-sm mt-1 text-red-600/90">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:scale-110 transition-transform duration-500">
              <LayoutList size={100} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Sales</p>
            <p className="text-3xl font-black text-gray-900">{filteredOrders.length}</p>
          </div>
          
          <div className="bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100 p-5 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-500 text-emerald-600">
              <CheckCircle size={100} />
            </div>
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Verified</p>
            <p className="text-3xl font-black text-emerald-900">{verifiedCount}</p>
          </div>
          
          <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-100 p-5 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-500 text-amber-600">
              <Clock size={100} />
            </div>
            <p className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">Pending</p>
            <p className="text-3xl font-black text-amber-900">{pendingCount}</p>
          </div>
          
          <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-100 p-5 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-500 text-blue-600">
              <TrendingUp size={100} />
            </div>
            <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">Total Revenue</p>
            <p className="text-3xl font-black text-blue-900">Rs. {getTotalRevenue().toLocaleString()}</p>
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
                placeholder="Search by Product, Buyer or Order ID..."
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
                { value: "VERIFIED", label: "Verified & Sold" }
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
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No sales yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            When customers buy your products, they will appear here. Make sure your listings are active!
          </p>
          <button
            onClick={() => router.push("/modules/uni-mart")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm hover:shadow transition-all"
          >
            View My Products
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No sales found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            We couldn't find any sales matching your current search or filters.
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
                  Sold on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="p-6 flex flex-col md:flex-row gap-8">
                {/* Image */}
                <div className="w-full md:w-48 h-48 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
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

                  {/* Buyer Info Block */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full md:w-fit">
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                      <UserSquare2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Buyer Details</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{order.buyer?.name || "Unknown Buyer"}</p>
                        <p className="text-xs font-medium text-gray-500">{order.buyer?.email || "-"}</p>
                      </div>
                      <div className="sm:border-l sm:border-gray-200 sm:pl-4">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Student ID</p>
                        <p className="text-sm font-bold text-gray-700">{order.buyer?.student_id || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-56 shrink-0 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  <button
                    onClick={() => router.push(`/modules/uni-mart/orders/${order.id}`)}
                    className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    View Details
                  </button>
                  
                  <button
                    onClick={() => router.push(`/modules/uni-mart/products/${order.product.id}`)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    View Product <ExternalLink size={14} />
                  </button>
                  
                  {order.paymentMethod === "BANK" && order.receiptUrl && (
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> View Receipt
                    </a>
                  )}
                  
                  {order.paymentStatus === "PENDING" && (
                    <button
                      onClick={() => router.push("/modules/uni-mart/sales")}
                      className="w-full px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <CheckCircle size={16} /> Verify Payment
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