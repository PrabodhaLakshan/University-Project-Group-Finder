// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { ArrowLeft, CheckCircle, Clock, AlertCircle, Download } from "lucide-react";
// import { getToken } from "@/lib/auth";
// import { startConversation } from "../../services/message.service";

// interface OrderDetails {
//   id: string;
//   paymentMethod: "BANK" | "CARD";
//   paymentStatus: "PENDING" | "PAID" | "VERIFIED";
//   receiptUrl?: string;
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
//   buyer: {
//     id: string;
//     name: string;
//     email: string;
//   };
// }

// export default function OrderDetailsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const orderId = params.orderId as string;
  
//   const [order, setOrder] = useState<OrderDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isStartingChat, setIsStartingChat] = useState(false);

//   useEffect(() => {
//     loadOrderDetails();
//   }, [orderId]);

//   const loadOrderDetails = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const response = await fetch(`/api/unimart/orders/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           router.push("/login");
//           return;
//         }
//         throw new Error("Failed to load order");
//       }

//       const data = await response.json();
//       setOrder(data);
//     } catch (err) {
//       console.error("Error loading order:", err);
//       setError(err instanceof Error ? err.message : "Failed to load order");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChatWithSeller = async () => {
//     if (!order || isStartingChat) return;

//     try {
//       const token = getToken();
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       setIsStartingChat(true);
//       const conversation = await startConversation({
//         productId: order.product.id,
//         sellerId: order.product.seller.id,
//         orderId: order.id,
//       });

//       router.push(`/modules/uni-mart/messages/${conversation.id}`);
//     } catch (err) {
//       console.error("Failed to open chat:", err);
//       alert(err instanceof Error ? err.message : "Failed to open chat");
//     } finally {
//       setIsStartingChat(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-3xl mx-auto">
//           <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700">
//             <ArrowLeft size={20} />
//             Back
//           </button>
//           <div className="bg-white rounded-lg shadow p-8 text-center">
//             <p className="text-gray-500">Loading order details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4">
//         <div className="max-w-3xl mx-auto">
//           <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700">
//             <ArrowLeft size={20} />
//             Back
//           </button>
//           <div className="bg-white rounded-lg shadow p-8 text-center border-l-4 border-red-500">
//             <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
//             <p className="text-red-600 font-semibold">{error || "Order not found"}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const statusConfig = {
//     PENDING: { icon: Clock, color: "yellow", label: "Payment Pending" },
//     VERIFIED: { icon: CheckCircle, color: "green", label: "Verified & Completed" },
//     PAID: { icon: CheckCircle, color: "green", label: "Paid" },
//   };

//   const config = statusConfig[order.paymentStatus];
//   const Icon = config.icon;

//   const colorClasses = {
//     yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
//     green: "bg-green-50 border-green-200 text-green-700",
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-3xl mx-auto">
//         {/* Back Button */}
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700 font-semibold"
//         >
//           <ArrowLeft size={20} />
//           Back
//         </button>

//         {/* Main Card */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className={`border-l-4 p-6 ${
//             order.paymentStatus === "VERIFIED" ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-500"
//           }`}>
//             <div className="flex items-start justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id.slice(0, 8)}</h1>
//                 <p className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
//               </div>
//               <div className="flex flex-col items-end">
//                 <Icon size={40} className={order.paymentStatus === "VERIFIED" ? "text-green-600" : "text-yellow-600"} />
//                 <span className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
//                   order.paymentStatus === "VERIFIED" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
//                 }`}>
//                   {config.label}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-6 space-y-6">
//             {/* Product Info */}
//             <div className="border-b pb-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Product Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {order.product.images[0] && (
//                   <div className="md:col-span-2 lg:col-span-1">
//                     <img 
//                       src={order.product.images[0]} 
//                       alt={order.product.title}
//                       className="w-full h-48 object-cover rounded-lg border border-gray-200"
//                     />
//                   </div>
//                 )}
//                 <div className="space-y-2">
//                   <div>
//                     <p className="text-gray-600 text-sm">Product Title</p>
//                     <p className="text-lg font-semibold text-gray-900">{order.product.title}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Price</p>
//                     <p className="text-2xl font-bold text-blue-600">Rs. {order.product.price.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Product ID</p>
//                     <p className="text-gray-900 font-mono text-sm">{order.product.id}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Buyer & Seller Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900 mb-3">Buyer Information</h3>
//                 <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//                   <div>
//                     <p className="text-gray-600 text-sm">Name</p>
//                     <p className="font-semibold text-gray-900">{order.buyer?.name || "Unknown Buyer"}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Email</p>
//                     <p className="text-gray-900 break-all">{order.buyer?.email || "-"}</p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold text-gray-900 mb-3">Seller Information</h3>
//                 <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//                   <div>
//                     <p className="text-gray-600 text-sm">Name</p>
//                     <p className="font-semibold text-gray-900">{order.product.seller?.name || "Unknown Seller"}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 text-sm">Email</p>
//                     <p className="text-gray-900 break-all">{order.product.seller?.email || "-"}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Info */}
//             <div className="border-b pb-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-gray-600 text-sm">Payment Method</p>
//                   <p className="text-lg font-semibold text-gray-900">
//                     {order.paymentMethod === "BANK" ? "Bank Deposit" : "Card Payment"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-gray-600 text-sm">Payment Status</p>
//                   <p className={`text-lg font-semibold ${
//                     order.paymentStatus === "VERIFIED" ? "text-green-600" : "text-yellow-600"
//                   }`}>
//                     {order.paymentStatus}
//                   </p>
//                 </div>
//               </div>

//               {/* Receipt Image for Bank Payment */}
//               {order.paymentMethod === "BANK" && order.receiptUrl && (
//                 <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                   <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//                     <Download size={18} />
//                     Payment Receipt
//                   </h4>
//                   <img
//                     src={order.receiptUrl}
//                     alt="Payment receipt"
//                     className="max-w-sm rounded-lg border border-gray-300 shadow-sm"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Order Timeline */}
//             <div>
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
//               <div className="space-y-3">
//                 <div className="flex gap-4">
//                   <div className="flex flex-col items-center">
//                     <div className="w-3 h-3 rounded-full bg-blue-600"></div>
//                     <div className="w-1 h-12 bg-gray-300"></div>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900">Order Created</p>
//                     <p className="text-gray-600 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
//                   </div>
//                 </div>
                
//                 {order.paymentStatus !== "PENDING" && (
//                   <div className="flex gap-4">
//                     <div className="flex flex-col items-center">
//                       <div className="w-3 h-3 rounded-full bg-green-600"></div>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">Payment {order.paymentStatus === "VERIFIED" ? "Verified" : "Processed"}</p>
//                       <p className="text-gray-600 text-sm">Payment confirmed and order completed</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="bg-gray-50 px-6 py-4 border-t flex gap-3">
//             <button
//               onClick={() => router.back()}
//               className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleChatWithSeller}
//               disabled={isStartingChat}
//               className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400"
//             >
//               {isStartingChat ? "Opening Chat..." : "Chat with Seller"}
//             </button>
//             <button
//               onClick={() => window.print()}
//               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Print / Save as PDF
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Oxanium } from "next/font/google";
import { 
  ArrowLeft, CheckCircle, Clock, AlertCircle, Download, 
  Copy, Check, MessageSquare, Printer, MapPin, CreditCard,
  Building2, User, Package
} from "lucide-react";
import { getToken } from "@/lib/auth";
import { startConversation } from "../../services/message.service";

// Initialize Oxanium font
const oxanium = Oxanium({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"] 
});

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
  const [copiedId, setCopiedId] = useState(false);

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

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50/50 p-4 flex flex-col items-center justify-center ${oxanium.className}`}>
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={`min-h-screen bg-gray-50/50 p-4 ${oxanium.className}`}>
        <div className="max-w-3xl mx-auto mt-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors mb-6 group">
            <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back
          </button>
          <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-500">{error || "Order not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDING: { 
      icon: Clock, 
      label: "Payment Pending", 
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      headerClass: "bg-gradient-to-r from-amber-50 to-white border-amber-100",
      iconClass: "text-amber-500"
    },
    VERIFIED: { 
      icon: CheckCircle, 
      label: "Verified & Completed", 
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      headerClass: "bg-gradient-to-r from-emerald-50 to-white border-emerald-100",
      iconClass: "text-emerald-500"
    },
    PAID: { 
      icon: CheckCircle, 
      label: "Paid", 
      badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      headerClass: "bg-gradient-to-r from-blue-50 to-white border-blue-100",
      iconClass: "text-blue-500"
    },
  };

  const config = statusConfig[order.paymentStatus];
  const StatusIcon = config.icon;

  return (
    <div className={`min-h-screen bg-gray-50/50 py-8 px-4 ${oxanium.className}`}>
      <div className="max-w-4xl mx-auto print:max-w-full">
        
        {/* Back Button - Hidden on Print */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors mb-6 group w-fit print:hidden"
        >
          <div className="p-1.5 rounded-md bg-white border border-gray-200 shadow-sm group-hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Orders
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          
          {/* Header Banner */}
          <div className={`p-8 border-b ${config.headerClass}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order #{order.id.slice(0, 8)}</h1>
                  <button 
                    onClick={handleCopyOrderId}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors print:hidden"
                    title="Copy Full Order ID"
                  >
                    {copiedId ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-gray-500 flex items-center gap-2 font-medium">
                  <Clock size={16} />
                  {new Date(order.createdAt).toLocaleString('en-US', { 
                    dateStyle: 'medium', 
                    timeStyle: 'short' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100/50">
                <StatusIcon size={24} className={config.iconClass} />
                <span className={`px-2.5 py-1 rounded-lg text-sm font-bold tracking-wide border ${config.badgeClass}`}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 space-y-10">
            
            {/* Product Info */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Package className="text-blue-500" size={20} />
                Product Details
              </h2>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-6">
                {order.product.images[0] ? (
                  <div className="w-full md:w-48 h-48 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img 
                      src={order.product.images[0]} 
                      alt={order.product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-48 h-48 shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Product Title</p>
                    <p className="text-xl font-bold text-gray-900">{order.product.title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Price</p>
                    <p className="text-3xl font-black text-blue-600">Rs. {order.product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Product Reference</p>
                    <p className="text-gray-600 font-mono text-sm bg-gray-50 px-3 py-1.5 rounded-lg w-fit border border-gray-100">
                      {order.product.id}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Buyer & Seller Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="text-indigo-500" size={20} />
                  Buyer Information
                </h3>
                <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-4 h-full">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Name</p>
                    <p className="font-semibold text-gray-900 text-lg">{order.buyer?.name || "Unknown Buyer"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email</p>
                    <p className="text-gray-700 font-medium break-all">{order.buyer?.email || "-"}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="text-purple-500" size={20} />
                  Seller Information
                </h3>
                <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-4 h-full">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Name</p>
                    <p className="font-semibold text-gray-900 text-lg">{order.product.seller?.name || "Unknown Seller"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email</p>
                    <p className="text-gray-700 font-medium break-all">{order.product.seller?.email || "-"}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Payment Info */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-emerald-500" size={20} />
                Payment Information
              </h3>
              
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Method</p>
                    <div className="flex items-center gap-2">
                      {order.paymentMethod === "BANK" ? <Building2 className="text-gray-400" size={18}/> : <CreditCard className="text-gray-400" size={18}/>}
                      <p className="text-lg font-bold text-gray-900">
                        {order.paymentMethod === "BANK" ? "Bank Deposit" : "Card Payment"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Status</p>
                    <p className={`text-lg font-bold ${
                      order.paymentStatus === "VERIFIED" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>

                {/* Receipt Image for Bank Payment */}
                {order.paymentMethod === "BANK" && order.receiptUrl && (
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                      <Download size={16} className="text-blue-500"/>
                      Uploaded Receipt
                    </h4>
                    <div className="bg-gray-50 p-2 rounded-xl border border-gray-200 inline-block">
                      <img
                        src={order.receiptUrl}
                        alt="Payment receipt"
                        className="max-w-sm w-full object-contain rounded-lg shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Order Timeline */}
            <section className="print:break-inside-avoid">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-rose-500" size={20} />
                Order Timeline
              </h3>
              
              <div className="pl-2 space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-100">
                
                {/* Timeline Item 1: Created */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-1.5 md:ml-0"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="font-bold text-gray-900 mb-1">Order Created</p>
                    <p className="text-gray-500 text-sm font-medium">
                      {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                
                {/* Timeline Item 2: Payment Verified (If applicable) */}
                {order.paymentStatus !== "PENDING" && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ml-1.5 md:ml-0"></div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="font-bold text-emerald-900 mb-1">Payment {order.paymentStatus === "VERIFIED" ? "Verified" : "Processed"}</p>
                      <p className="text-emerald-700/80 text-sm font-medium">Payment confirmed and order completed</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Back
            </button>
            <button
              onClick={handleChatWithSeller}
              disabled={isStartingChat}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isStartingChat ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <MessageSquare size={18} />
              )}
              {isStartingChat ? "Opening Chat..." : "Chat with Seller"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Printer size={18} />
              Print / Save PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}