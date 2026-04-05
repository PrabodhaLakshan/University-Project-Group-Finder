// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getProductById } from "../../services/product.service";
// import { Product } from "../../types";
// import { ArrowLeft, AlertCircle, HandshakeIcon, CreditCard, Banknote } from "lucide-react";
// import BankDepositForm from "./components/BankDepositForm";
// import CardPaymentForm from "./components/CardPaymentForm";
// import HandoverForm, { HandoverDetails } from "./components/HandoverForm";
// import { getToken } from "@/lib/auth";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const params = useParams();
//   const productId = typeof params.productId === "string" ? params.productId : "";

//   const [product, setProduct] = useState<Product | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CARD" | "HANDOVER">("BANK");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   useEffect(() => {
//     const loadProduct = async () => {
//       if (!productId) {
//         setError("Invalid product ID");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);
//         const data = await getProductById(productId);
//         setProduct(data);
//       } catch (err) {
//         const message = err instanceof Error ? err.message : "Failed to load product";
//         setError(message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProduct();
//   }, [productId]);

//   const handleBankDepositSubmit = async (receiptFile: File) => {
//     if (!product) return;

//     try {
//       setIsProcessing(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         throw new Error("Please log in to continue checkout");
//       }

//       // Upload receipt and create order
//       const formData = new FormData();
//       formData.append("productId", product.id);
//       formData.append("paymentMethod", "BANK");
//       formData.append("receipt", receiptFile);

//       const response = await fetch("/api/unimart/orders/bank-deposit", {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create order");
//       }

//       setSuccessMessage(
//         "Order created successfully! Your receipt has been uploaded for verification."
//       );
//       setTimeout(() => {
//         router.push("/uni-mart/purchase-history");
//       }, 2000);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to process order";
//       setError(message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleCardPaymentSubmit = async (cardDetails: any) => {
//     if (!product) return;

//     try {
//       setIsProcessing(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         throw new Error("Please log in to continue checkout");
//       }

//       // Create card payment order (will return Stripe checkout URL)
//       const response = await fetch("/api/unimart/orders/card-payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           paymentMethod: "CARD",
//           ...cardDetails,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create card payment");
//       }

//       const { checkoutUrl } = await response.json();
//       // Redirect to Stripe checkout
//       window.location.href = checkoutUrl;
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to process payment";
//       setError(message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleHandoverSubmit = async (details: HandoverDetails) => {
//     if (!product) return;

//     try {
//       setIsProcessing(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         throw new Error("Please log in to continue checkout");
//       }

//       // Create handover meeting order
//       const response = await fetch("/api/unimart/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           paymentMethod: "HANDOVER",
//           meetingDates: details.meetingDates,
//           meetingLocations: details.meetingLocations,
//           additionalNotes: details.additionalNotes,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create handover meeting");
//       }

//       setSuccessMessage(
//         "Handover request sent to seller! They will confirm the meeting details with you soon."
//       );
//       setTimeout(() => {
//         router.push("/uni-mart/purchase-history");
//       }, 2000);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to process handover meeting";
//       setError(message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <div className="inline-block p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4">
//             <div className="animate-spin w-8 h-8 border-3 border-blue-300 border-t-blue-600 rounded-full"></div>
//           </div>
//           <p className="text-gray-600 font-medium">Loading product...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="max-w-2xl mx-auto">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition"
//         >
//           <ArrowLeft size={20} />
//           Back
//         </button>
//         <div className="bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-300/50 p-6 text-red-700">
//           {error || "Product not found"}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-8 transition group"
//       >
//         <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
//         Back
//       </button>

//       <div className="mb-8">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
//           Secure Checkout
//         </h1>
//         <p className="text-gray-600">Complete your purchase with your preferred payment method</p>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-2xl border border-red-300/50 bg-red-500/10 backdrop-blur-md p-4 flex gap-3 text-red-700">
//           <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
//           <div className="font-medium">{error}</div>
//         </div>
//       )}

//       {successMessage && (
//         <div className="mb-6 rounded-2xl border border-green-300/50 bg-green-500/10 backdrop-blur-md p-4 text-green-700 font-medium">
//           ✓ {successMessage}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Product Summary */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Order Summary Card */}
//           <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

//             <div className="flex gap-4 pb-6 border-b border-white/40">
//               {product.images[0] && (
//                 <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
//                   <img
//                     src={product.images[0]}
//                     alt={product.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
//                 <p className="text-gray-600 text-sm mt-2">{product.category}</p>
//                 <p className="text-gray-600 text-sm mt-1">
//                   Condition: <span className="font-semibold text-gray-900">{product.condition}</span>
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 space-y-3">
//               <div className="flex justify-between text-gray-600">
//                 <span>Price</span>
//                 <span className="font-semibold text-gray-900">Rs. {product.price.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3 border-t border-white/40">
//                 <span className="text-lg font-bold text-gray-900">Total Amount</span>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Rs. {product.price.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* Seller Info */}
//             <div className="mt-6 pt-6 border-t border-white/40">
//               <p className="text-sm text-gray-600 mb-3">Selling by</p>
//               <div className="bg-blue-500/10 rounded-xl p-4">
//                 <p className="font-bold text-gray-900">{product.sellerName}</p>
//                 <p className="text-sm text-gray-600 mt-1">{product.sellerEmail}</p>
//               </div>
//             </div>
//           </div>

//           {/* Payment Method Selection */}
//           <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

//             <div className="space-y-3">
//               {/* Bank Deposit Option */}
//               <label className="flex items-start p-4 border-2 border-transparent rounded-xl cursor-pointer hover:bg-blue-500/5 transition group"
//                 style={{
//                   borderColor: paymentMethod === "BANK" ? "#3b82f6" : "#e5e7eb",
//                   backgroundColor: paymentMethod === "BANK" ? "rgba(59, 130, 246, 0.05)" : "transparent",
//                 }}>
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="BANK"
//                   checked={paymentMethod === "BANK"}
//                   onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
//                   className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0"
//                 />
//                 <div className="ml-4 flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Banknote size={20} className="text-blue-600" />
//                     <p className="font-bold text-gray-900">Bank Deposit</p>
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Transfer money to the seller's bank account and upload receipt for verification
//                   </p>
//                 </div>
//               </label>

//               {/* Card Payment Option */}
//               <label className="flex items-start p-4 border-2 border-transparent rounded-xl cursor-pointer hover:bg-green-500/5 transition group"
//                 style={{
//                   borderColor: paymentMethod === "CARD" ? "#10b981" : "#e5e7eb",
//                   backgroundColor: paymentMethod === "CARD" ? "rgba(16, 185, 129, 0.05)" : "transparent",
//                 }}>
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="CARD"
//                   checked={paymentMethod === "CARD"}
//                   onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
//                   className="w-5 h-5 text-green-600 mt-1 flex-shrink-0"
//                 />
//                 <div className="ml-4 flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <CreditCard size={20} className="text-green-600" />
//                     <p className="font-bold text-gray-900">Card Payment</p>
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Pay securely using credit/debit card through our secure payment gateway
//                   </p>
//                 </div>
//               </label>

//               {/* Handover Option */}
//               <label className="flex items-start p-4 border-2 border-transparent rounded-xl cursor-pointer hover:bg-purple-500/5 transition group"
//                 style={{
//                   borderColor: paymentMethod === "HANDOVER" ? "#a855f7" : "#e5e7eb",
//                   backgroundColor: paymentMethod === "HANDOVER" ? "rgba(168, 85, 247, 0.05)" : "transparent",
//                 }}>
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="HANDOVER"
//                   checked={paymentMethod === "HANDOVER"}
//                   onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
//                   className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0"
//                 />
//                 <div className="ml-4 flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <HandshakeIcon size={20} className="text-purple-600" />
//                     <p className="font-bold text-gray-900">Handover (Pay on Meet)</p>
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Meet the seller in person, inspect the item, and pay on the spot
//                   </p>
//                 </div>
//               </label>
//             </div>
//           </div>

//           {/* Conditional Payment Forms */}
//           {paymentMethod === "BANK" && (
//             <div className="mt-6">
//               <BankDepositForm
//                 onSubmit={handleBankDepositSubmit}
//                 isProcessing={isProcessing}
//               />
//             </div>
//           )}

//           {paymentMethod === "CARD" && (
//             <div className="mt-6">
//               <CardPaymentForm
//                 onSubmit={handleCardPaymentSubmit}
//                 isProcessing={isProcessing}
//               />
//             </div>
//           )}

//           {paymentMethod === "HANDOVER" && (
//             <div className="mt-6">
//               <HandoverForm
//                 onSubmit={handleHandoverSubmit}
//                 isProcessing={isProcessing}
//                 sellerLocation={product.location || "Campus"}
//               />
//             </div>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="lg:col-span-1">
//           <div className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 backdrop-blur-md rounded-2xl border border-blue-300/30 shadow-lg p-6 sticky top-24 space-y-4">
//             <h3 className="font-bold text-gray-900 text-lg mb-4">Why Shop with Us?</h3>
            
//             <div className="space-y-3">
//               <div className="flex gap-3">
//                 <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
//                 <span className="text-sm text-gray-700"><strong>Verified Sellers</strong> - All sellers are campus verified</span>
//               </div>
//               <div className="flex gap-3">
//                 <span className="text-green-600 font-bold flex-shrink-0">✓</span>
//                 <span className="text-sm text-gray-700"><strong>Authentic Products</strong> - Campus verified items only</span>
//               </div>
//               <div className="flex gap-3">
//                 <span className="text-purple-600 font-bold flex-shrink-0">✓</span>
//                 <span className="text-sm text-gray-700"><strong>Direct Communication</strong> - Chat directly with sellers</span>
//               </div>
//               <div className="flex gap-3">
//                 <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
//                 <span className="text-sm text-gray-700"><strong>Multiple Payment Options</strong> - Card, bank, or handover</span>
//               </div>
//               <div className="flex gap-3">
//                 <span className="text-red-600 font-bold flex-shrink-0">✓</span>
//                 <span className="text-sm text-gray-700"><strong>Safe & Secure</strong> - Meet on campus in public</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }















// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getProductById } from "../../services/product.service";
// import { Product } from "../../types";
// import { 
//   ArrowLeft, 
//   AlertCircle, 
//   HandshakeIcon, 
//   CreditCard, 
//   Banknote,
//   ShieldCheck,
//   MapPin,
//   Eye,
//   Users,
//   LifeBuoy,
//   Shield,
//   HelpCircle,
//   Clock,
//   CheckCircle2,
//   CheckCircle
// } from "lucide-react";
// import BankDepositForm from "./components/BankDepositForm";
// import CardPaymentForm from "./components/CardPaymentForm";
// import HandoverForm, { HandoverDetails } from "./components/HandoverForm";
// import Footer from "@/components/footer";
// import { getToken } from "@/lib/auth";
// import { Oxanium, Inter } from "next/font/google";

// const oxanium = Oxanium({
//   subsets: ["latin"],
//   weight: ["500", "600", "700", "800"],
// });

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });

// const AD_IMAGES = [
//   "/images/advertisement/advertisement1.jpg",
//   "/images/advertisement/advertisement2.jpg",
//   "/images/advertisement/advertisement3.jpg",
//   "/images/advertisement/advertisement4.jpg",
//   "/images/advertisement/advertisement5.jpg"
// ];

// export default function CheckoutPage() {
//   const router = useRouter();
//   const params = useParams();
//   const productId = typeof params.productId === "string" ? params.productId : "";

//   const [product, setProduct] = useState<Product | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CARD" | "HANDOVER">("BANK");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
//   // Ad Slider state
//   const [currentAdIndex, setCurrentAdIndex] = useState(0);

//   useEffect(() => {
//     const loadProduct = async () => {
//       if (!productId) {
//         setError("Invalid product ID");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);
//         const data = await getProductById(productId);
//         setProduct(data);
//       } catch (err) {
//         const message = err instanceof Error ? err.message : "Failed to load product";
//         setError(message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProduct();
//   }, [productId]);

//   // Ad Slider Effect (Change image every 7 seconds)
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentAdIndex((prevIndex) => (prevIndex + 1) % AD_IMAGES.length);
//     }, 7000);
//     return () => clearInterval(timer);
//   }, []);

//   const handleBankDepositSubmit = async (receiptFile: File) => {
//     if (!product) return;

//     try {
//       setIsProcessing(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         throw new Error("Please log in to continue checkout");
//       }

//       const formData = new FormData();
//       formData.append("productId", product.id);
//       formData.append("paymentMethod", "BANK");
//       formData.append("receipt", receiptFile);

//       const response = await fetch("/api/unimart/orders/bank-deposit", {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create order");
//       }

//       setSuccessMessage(
//         "Order created successfully! Your receipt has been uploaded for verification."
//       );
//       setTimeout(() => {
//         router.push("/modules/uni-mart/purchase-history");
//       }, 2000);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to process order";
//       setError(message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleCardPaymentSubmit = async (cardDetails: any) => {
//     if (!product) return;

//     try {
//       setIsProcessing(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         throw new Error("Please log in to continue checkout");
//       }

//       const response = await fetch("/api/unimart/orders/card-payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           paymentMethod: "CARD",
//           ...cardDetails,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create card payment");
//       }

//       const { checkoutUrl } = await response.json();
//       window.location.href = checkoutUrl;
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to process payment";
//       setError(message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleHandoverSubmit = async (details: HandoverDetails) => {
//     if (!product) return;

//     try {
//       setIsProcessing(true);
//       setError(null);
//       const token = getToken();

//       if (!token) {
//         throw new Error("Please log in to continue checkout");
//       }

//       const response = await fetch("/api/unimart/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           paymentMethod: "HANDOVER",
//           meetingDates: details.meetingDates,
//           meetingLocations: details.meetingLocations,
//           additionalNotes: details.additionalNotes,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "Failed to create handover meeting");
//       }

//       setSuccessMessage(
//         "Handover request sent to seller! They will confirm the meeting details with you soon."
//       );
//       setTimeout(() => {
//         router.push("/modules/uni-mart/purchase-history");
//       }, 2000);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Failed to process handover meeting";
//       setError(message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[70vh]">
//         <div className="text-center">
//           <div className="inline-block p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl mb-4 backdrop-blur-xl border border-white/50 shadow-xl">
//             <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
//           </div>
//           <p className={`${oxanium.className} text-gray-600 font-semibold text-lg tracking-wide animate-pulse`}>Loading secure checkout...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="max-w-2xl mx-auto py-12 px-4">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition"
//         >
//           <ArrowLeft size={20} />
//           Back
//         </button>
//         <div className="bg-red-500/10 backdrop-blur-md rounded-3xl border border-red-300/50 p-8 text-red-700 text-center shadow-lg">
//           <AlertCircle size={48} className="mx-auto mb-4 opacity-80" />
//           <h2 className={`${oxanium.className} text-2xl font-bold mb-2`}>Product Not Found</h2>
//           <p>{error || "The product you are looking for is unavailable."}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//     <div className={`relative min-h-screen pb-0 flex flex-col overflow-x-hidden ${inter.className}`}>
      
//       {/* Abstract Background Elements for Modern Look */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
//         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px]"></div>
//         <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-400/10 blur-[120px]"></div>
//         <div className="absolute top-[30%] left-[60%] w-[20%] h-[20%] rounded-full bg-emerald-400/10 blur-[100px]"></div>
//       </div>

//       <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-grow">
//         <button
//           onClick={() => router.back()}
//           className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold mb-8 transition-all group bg-white/50 hover:bg-white px-4 py-2 rounded-xl border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           Back to Product
//         </button>

//         <div className="mb-10">
//           <h1 className={`${oxanium.className} text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight`}>
//             Secure Checkout
//           </h1>
//           <p className="text-gray-500 text-lg">Complete your purchase quickly and securely.</p>
//         </div>

//         {error && (
//           <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-xl p-5 flex gap-4 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-4">
//             <AlertCircle size={24} className="flex-shrink-0 text-red-500" />
//             <div className="font-medium">{error}</div>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 backdrop-blur-xl p-5 flex gap-4 text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-4">
//             <CheckCircle size={24} className="flex-shrink-0 text-emerald-500" />
//             <div className="font-medium">{successMessage}</div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
//           {/* Main Content Area (Forms & Selection) */}
//           <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
//             {/* Order Summary Card */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 overflow-hidden relative">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
//               <h2 className={`${oxanium.className} text-2xl font-bold text-gray-900 mb-6`}>Order Summary</h2>

//               <div className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100">
//                 {product.images[0] ? (
//                   <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner border border-gray-100 p-2">
//                     <img
//                       src={product.images[0]}
//                       alt={product.title}
//                       className="w-full h-full object-contain rounded-xl"
//                     />
//                   </div>
//                 ) : (
//                   <div className="w-full sm:w-36 h-36 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
//                     No Image
//                   </div>
//                 )}
                
//                 <div className="flex-1 flex flex-col justify-center">
//                   <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg w-fit mb-3">
//                     {product.category}
//                   </div>
//                   <h3 className={`${oxanium.className} text-xl font-bold text-gray-900 leading-tight mb-2`}>{product.title}</h3>
//                   <div className="flex items-center gap-2 text-sm text-gray-500">
//                     <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
//                     Condition: <span className="font-semibold text-gray-800 capitalize">{product.condition.toLowerCase()}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-4">
//                 <div className="flex justify-between items-center text-gray-500">
//                   <span className="text-sm font-medium">Subtotal</span>
//                   <span className="font-semibold text-gray-900">Rs. {product.price.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-gray-500 pb-4 border-b border-dashed border-gray-200">
//                   <span className="text-sm font-medium">Platform Fee</span>
//                   <span className="font-semibold text-emerald-600">Free</span>
//                 </div>
                
//                 <div className="flex justify-between items-end pt-2">
//                   <div>
//                     <span className="block text-sm font-medium text-gray-500 mb-1">Total Payment</span>
//                     <span className="text-sm text-gray-400">Including all taxes</span>
//                   </div>
//                   <span className={`${oxanium.className} text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
//                     Rs. {product.price.toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               {/* Seller Info Pill */}
//               <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-200">
//                   {product.sellerName.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Seller</p>
//                   <p className="font-bold text-gray-900 leading-none">{product.sellerName}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method Selection */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
//               <h2 className={`${oxanium.className} text-2xl font-bold text-gray-900 mb-6`}>How would you like to pay?</h2>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {/* Bank Deposit Option */}
//                 <label className={`relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
//                   paymentMethod === "BANK" 
//                   ? "bg-blue-50/50 border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" 
//                   : "bg-white border-gray-100 hover:border-blue-200 hover:bg-slate-50 shadow-sm"
//                 }`}>
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="BANK"
//                     checked={paymentMethod === "BANK"}
//                     onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
//                     className="sr-only"
//                   />
//                   <div className="flex justify-between items-start mb-4">
//                     <div className={`p-2.5 rounded-xl ${paymentMethod === "BANK" ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "bg-gray-100 text-gray-500"}`}>
//                       <Banknote size={22} />
//                     </div>
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "BANK" ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
//                       {paymentMethod === "BANK" && <div className="w-2 h-2 rounded-full bg-white" />}
//                     </div>
//                   </div>
//                   <p className="font-bold text-gray-900 mb-1">Bank Deposit</p>
//                   <p className="text-xs text-gray-500 leading-relaxed">Manual transfer with receipt upload</p>
//                 </label>

//                 {/* Card Payment Option */}
//                 <label className={`relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
//                   paymentMethod === "CARD" 
//                   ? "bg-emerald-50/50 border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" 
//                   : "bg-white border-gray-100 hover:border-emerald-200 hover:bg-slate-50 shadow-sm"
//                 }`}>
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="CARD"
//                     checked={paymentMethod === "CARD"}
//                     onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
//                     className="sr-only"
//                   />
//                   <div className="flex justify-between items-start mb-4">
//                     <div className={`p-2.5 rounded-xl ${paymentMethod === "CARD" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-gray-100 text-gray-500"}`}>
//                       <CreditCard size={22} />
//                     </div>
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "CARD" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
//                       {paymentMethod === "CARD" && <div className="w-2 h-2 rounded-full bg-white" />}
//                     </div>
//                   </div>
//                   <p className="font-bold text-gray-900 mb-1">Pay by Card</p>
//                   <p className="text-xs text-gray-500 leading-relaxed">Secure online gateway (Stripe)</p>
//                 </label>

//                 {/* Handover Option */}
//                 <label className={`relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
//                   paymentMethod === "HANDOVER" 
//                   ? "bg-purple-50/50 border-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.1)]" 
//                   : "bg-white border-gray-100 hover:border-purple-200 hover:bg-slate-50 shadow-sm"
//                 }`}>
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="HANDOVER"
//                     checked={paymentMethod === "HANDOVER"}
//                     onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
//                     className="sr-only"
//                   />
//                   <div className="flex justify-between items-start mb-4">
//                     <div className={`p-2.5 rounded-xl ${paymentMethod === "HANDOVER" ? "bg-purple-500 text-white shadow-md shadow-purple-500/20" : "bg-gray-100 text-gray-500"}`}>
//                       <HandshakeIcon size={22} />
//                     </div>
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "HANDOVER" ? "border-purple-500 bg-purple-500" : "border-gray-300"}`}>
//                       {paymentMethod === "HANDOVER" && <div className="w-2 h-2 rounded-full bg-white" />}
//                     </div>
//                   </div>
//                   <p className="font-bold text-gray-900 mb-1">Handover</p>
//                   <p className="text-xs text-gray-500 leading-relaxed">Meet on campus and pay in cash</p>
//                 </label>
//               </div>

//               {/* Form Container with Animation */}
//               <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 {paymentMethod === "BANK" && (
//                   <BankDepositForm
//                     onSubmit={handleBankDepositSubmit}
//                     isProcessing={isProcessing}
//                   />
//                 )}
//                 {paymentMethod === "CARD" && (
//                   <CardPaymentForm
//                     onSubmit={handleCardPaymentSubmit}
//                     isProcessing={isProcessing}
//                   />
//                 )}
//                 {paymentMethod === "HANDOVER" && (
//                   <HandoverForm
//                     onSubmit={handleHandoverSubmit}
//                     isProcessing={isProcessing}
//                     sellerLocation={product.location || "Campus"}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar Area */}
//           <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
//             {/* Card 1: Buyer Protection */}
//             <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 relative overflow-hidden">
//               <div className="absolute -right-6 -top-6 text-emerald-500/10">
//                 <Shield size={120} />
//               </div>
//               <div className="relative z-10">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
//                     <Shield size={20} />
//                   </div>
//                   <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg`}>Buyer Protection</h3>
//                 </div>
//                 <p className="text-sm text-gray-600 leading-relaxed mb-5">
//                   Your payment is securely held by Uni-Mart. We only release funds to the seller after you receive the item and confirm it matches the description.
//                 </p>
//                 <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold bg-white/60 backdrop-blur border border-emerald-200/60 p-3 rounded-xl shadow-sm">
//                   <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500" />
//                   <span>100% Money Back Guarantee</span>
//                 </div>
//               </div>
//             </div>

//             {/* Card 2: Why Shop with Us? */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
//               <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg mb-5`}>Why Shop with Us?</h3>
              
//               <div className="space-y-4">
//                 <div className="flex gap-3 items-start">
//                   <div className="mt-0.5 bg-blue-100 text-blue-600 rounded-full p-1"><CheckCircle size={14} /></div>
//                   <p className="text-sm text-gray-600"><strong className="text-gray-900">Verified Sellers</strong><br/>All sellers are campus verified</p>
//                 </div>
//                 <div className="flex gap-3 items-start">
//                   <div className="mt-0.5 bg-purple-100 text-purple-600 rounded-full p-1"><CheckCircle size={14} /></div>
//                   <p className="text-sm text-gray-600"><strong className="text-gray-900">Direct Chat</strong><br/>Communicate easily within the platform</p>
//                 </div>
//                 <div className="flex gap-3 items-start">
//                   <div className="mt-0.5 bg-amber-100 text-amber-600 rounded-full p-1"><CheckCircle size={14} /></div>
//                   <p className="text-sm text-gray-600"><strong className="text-gray-900">Flexible Payments</strong><br/>Card, bank transfer, or cash on meet</p>
//                 </div>
//               </div>
//             </div>

//             {/* Ad Slider - Standalone 3D Look (object-fill forces 100% width and 100% height without any gaps or crop) */}
//             <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] border border-white/40 group bg-gray-50">
//               <a href="https://www.sliit.lk/" target="_blank" rel="noopener noreferrer" className="absolute inset-0 w-full h-full z-10 block">
//                 {AD_IMAGES.map((src, index) => (
//                   <img
//                     key={src}
//                     src={src}
//                     alt={`Advertisement ${index + 1}`}
//                     className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
//                       index === currentAdIndex ? "opacity-100 z-10" : "opacity-0 z-0"
//                     }`}
//                   />
//                 ))}
//               </a>
              
//               {/* Decreasing progress bar */}
//               <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20 z-20 backdrop-blur-sm">
//                 <div 
//                   key={currentAdIndex} 
//                   className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
//                   style={{ animation: 'shrinkProgress 7s linear forwards' }}
//                 />
//               </div>
//             </div>
//             {/* Inject keyframes for the progress bar animation */}
//             <style dangerouslySetInnerHTML={{__html: `
//               @keyframes shrinkProgress {
//                 0% { width: 100%; }
//                 100% { width: 0%; }
//               }
//             `}} />

//             {/* Card 3: Safe Handover Tips */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
//                   <ShieldCheck size={20} />
//                 </div>
//                 <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg`}>Safe Handover</h3>
//               </div>
//               <ul className="space-y-4">
//                 <li className="flex gap-3 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
//                   <MapPin size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
//                   <span>Meet in well-lit, public campus areas like the main canteen.</span>
//                 </li>
//                 <li className="flex gap-3 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
//                   <Eye size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
//                   <span>Inspect the item thoroughly before finalizing the payment.</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Card 4: Quick FAQs */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
//                   <HelpCircle size={20} />
//                 </div>
//                 <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg`}>Quick FAQs</h3>
//               </div>
//               <div className="space-y-5">
//                 <div className="group">
//                   <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5 group-hover:text-indigo-600 transition-colors">
//                     <Clock size={14} className="text-indigo-400"/> How long does verification take?
//                   </h4>
//                   <p className="text-sm text-gray-500 pl-6 leading-relaxed">Bank deposit receipts are typically verified within 1-2 hours during working days.</p>
//                 </div>
//                 <div className="w-full h-px bg-gray-100"></div>
//                 <div className="group">
//                   <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5 group-hover:text-indigo-600 transition-colors">
//                     <LifeBuoy size={14} className="text-indigo-400"/> What if I cancel?
//                   </h4>
//                   <p className="text-sm text-gray-500 pl-6 leading-relaxed">You can cancel the order anytime before the seller accepts the handover or ships the item.</p>
//                 </div>
//               </div>
//             </div>

//             {/* Card 5: Need Help? */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <LifeBuoy className="text-blue-500" size={24} />
//                 <h3 className="font-bold text-gray-900 text-lg">Need Assistance?</h3>
//               </div>
//               <p className="text-sm text-gray-600 mb-4">
//                 Having trouble with your checkout or need to report a suspicious listing?
//               </p>
//               <button className="w-full py-2.5 px-4 bg-blue-50 text-blue-600 rounded-xl font-semibold border border-blue-200 hover:bg-blue-100 transition shadow-sm">
//                 Contact Support
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
      
//     </div>
//     <div className="w-[100vw] relative left-[50%] -translate-x-[50%] mt-12 bg-white">
//        <Footer/> 
//       </div>
    
//     </div >
//   );
// } 














"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "../../services/product.service";
import { Product } from "../../types";
import { 
  ArrowLeft, 
  AlertCircle, 
  HandshakeIcon, 
  CreditCard, 
  Banknote,
  ShieldCheck,
  MapPin,
  Eye,
  Users,
  LifeBuoy,
  Shield,
  HelpCircle,
  Clock,
  CheckCircle2,
  CheckCircle
} from "lucide-react";
import BankDepositForm from "./components/BankDepositForm";
import CardPaymentForm from "./components/CardPaymentForm";
import HandoverForm, { HandoverDetails } from "./components/HandoverForm";
import Footer from "@/components/footer";
import { getToken } from "@/lib/auth";
import { Oxanium, Inter } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const AD_IMAGES = [
  "/images/advertisement/advertisement1.jpg",
  "/images/advertisement/advertisement2.jpg",
  "/images/advertisement/advertisement3.jpg",
  "/images/advertisement/advertisement4.jpg",
  "/images/advertisement/advertisement5.jpg"
];

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const productId = typeof params.productId === "string" ? params.productId : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CARD" | "HANDOVER">("BANK");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sellerAverageRating, setSellerAverageRating] = useState<number | null>(null);
  
  // Ad Slider state
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError("Invalid product ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load product";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Ad Slider Effect (Change image every 7 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % AD_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadSellerRating = async () => {
      if (!product?.sellerId) {
        setSellerAverageRating(null);
        return;
      }

      try {
        const response = await fetch(`/api/unimart/sellers/${product.sellerId}/stats`);
        if (!response.ok) {
          throw new Error("Failed to load seller rating");
        }

        const data = await response.json();
        setSellerAverageRating(
          typeof data?.averageRating === "number" ? data.averageRating : null
        );
      } catch {
        setSellerAverageRating(null);
      }
    };

    loadSellerRating();
  }, [product?.sellerId]);

  const formatPrice = (value: number | string) => {
    const numericValue =
      typeof value === "number"
        ? value
        : Number(String(value).replace(/[^0-9.-]/g, ""));

    return Number.isFinite(numericValue)
      ? `Rs. ${numericValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "Rs. 0.00";
  };

  const handleBankDepositSubmit = async (receiptFile: File) => {
    if (!product) return;

    try {
      setIsProcessing(true);
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error("Please log in to continue checkout");
      }

      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("paymentMethod", "BANK");
      formData.append("receipt", receiptFile);

      const response = await fetch("/api/unimart/orders/bank-deposit", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      setSuccessMessage(
        "Order created successfully! Your receipt has been uploaded for verification."
      );
      setTimeout(() => {
        router.push("/modules/uni-mart/purchase-history");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process order";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPaymentSubmit = async (cardDetails: any) => {
    if (!product) return;

    try {
      setIsProcessing(true);
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error("Please log in to continue checkout");
      }

      const response = await fetch("/api/unimart/orders/card-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          paymentMethod: "CARD",
          ...cardDetails,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create card payment");
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process payment";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHandoverSubmit = async (details: HandoverDetails) => {
    if (!product) return;

    try {
      setIsProcessing(true);
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error("Please log in to continue checkout");
      }

      const response = await fetch("/api/unimart/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          paymentMethod: "HANDOVER",
          meetingDates: details.meetingDates,
          meetingLocations: details.meetingLocations,
          additionalNotes: details.additionalNotes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create handover meeting");
      }

      setSuccessMessage(
        "Handover request sent to seller! They will confirm the meeting details with you soon."
      );
      setTimeout(() => {
        router.push("/modules/uni-mart/purchase-history");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process handover meeting";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl mb-4 backdrop-blur-xl border border-white/50 shadow-xl">
            <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className={`${oxanium.className} text-gray-600 font-semibold text-lg tracking-wide animate-pulse`}>Loading secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-500/10 backdrop-blur-md rounded-3xl border border-red-300/50 p-8 text-red-700 text-center shadow-lg">
          <AlertCircle size={48} className="mx-auto mb-4 opacity-80" />
          <h2 className={`${oxanium.className} text-2xl font-bold mb-2`}>Product Not Found</h2>
          <p>{error || "The product you are looking for is unavailable."}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
    <div className={`relative min-h-screen pb-0 flex flex-col overflow-x-hidden ${inter.className}`}>
      
      {/* Abstract Background Elements for Modern Look */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-400/10 blur-[120px]"></div>
        <div className="absolute top-[30%] left-[60%] w-[20%] h-[20%] rounded-full bg-emerald-400/10 blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-grow">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold mb-8 transition-all group bg-white/50 hover:bg-white px-4 py-2 rounded-xl border border-transparent hover:border-gray-200 shadow-sm hover:shadow"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Product
        </button>

        <div className="mb-10">
          <h1 className={`${oxanium.className} text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight`}>
            Secure Checkout
          </h1>
          <p className="text-gray-500 text-lg">Complete your purchase quickly and securely.</p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/80 backdrop-blur-xl p-5 flex gap-4 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={24} className="flex-shrink-0 text-red-500" />
            <div className="font-medium">{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 backdrop-blur-xl p-5 flex gap-4 text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-4">
            <CheckCircle size={24} className="flex-shrink-0 text-emerald-500" />
            <div className="font-medium">{successMessage}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Main Content Area (Forms & Selection) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            
            {/* Order Summary Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <h2 className={`${oxanium.className} text-2xl font-bold text-gray-900 mb-6`}>Order Summary</h2>

              <div className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100">
                {product.images[0] ? (
                  <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner border border-gray-100 p-2">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-36 h-36 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                    No Image
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg w-fit mb-3">
                    {product.category}
                  </div>
                  <h3 className={`${oxanium.className} text-xl font-bold text-gray-900 leading-tight mb-2`}>{product.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Condition: <span className="font-semibold text-gray-800 capitalize">{product.condition.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 pb-4 border-b border-dashed border-gray-200">
                  <span className="text-sm font-medium">Platform Fee</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <span className="block text-sm font-medium text-gray-500 mb-1">Total Payment</span>
                    <span className="text-sm text-gray-400">Including all taxes</span>
                  </div>
                  <span className={`${oxanium.className} text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {/* Seller Info Pill */}
              <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-200">
                  {product.sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Seller</p>
                  <p className="font-bold text-gray-900 leading-none">{product.sellerName}</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    {sellerAverageRating !== null
                      ? `★ ${sellerAverageRating.toFixed(1)} avg rating`
                      : "No ratings yet"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
              <h2 className={`${oxanium.className} text-2xl font-bold text-gray-900 mb-6`}>How would you like to pay?</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bank Deposit Option */}
                <label className={`relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                  paymentMethod === "BANK" 
                  ? "bg-blue-50/50 border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" 
                  : "bg-white border-gray-100 hover:border-blue-200 hover:bg-slate-50 shadow-sm"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK"
                    checked={paymentMethod === "BANK"}
                    onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${paymentMethod === "BANK" ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "bg-gray-100 text-gray-500"}`}>
                      <Banknote size={22} />
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "BANK" ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                      {paymentMethod === "BANK" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 mb-1">Bank Deposit</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Manual transfer with receipt upload</p>
                </label>

                {/* Card Payment Option */}
                <label className={`relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                  paymentMethod === "CARD" 
                  ? "bg-emerald-50/50 border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" 
                  : "bg-white border-gray-100 hover:border-emerald-200 hover:bg-slate-50 shadow-sm"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === "CARD"}
                    onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${paymentMethod === "CARD" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-gray-100 text-gray-500"}`}>
                      <CreditCard size={22} />
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "CARD" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                      {paymentMethod === "CARD" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 mb-1">Pay by Card</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Secure online gateway (Stripe)</p>
                </label>

                {/* Handover Option */}
                <label className={`relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                  paymentMethod === "HANDOVER" 
                  ? "bg-purple-50/50 border-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.1)]" 
                  : "bg-white border-gray-100 hover:border-purple-200 hover:bg-slate-50 shadow-sm"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="HANDOVER"
                    checked={paymentMethod === "HANDOVER"}
                    onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${paymentMethod === "HANDOVER" ? "bg-purple-500 text-white shadow-md shadow-purple-500/20" : "bg-gray-100 text-gray-500"}`}>
                      <HandshakeIcon size={22} />
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "HANDOVER" ? "border-purple-500 bg-purple-500" : "border-gray-300"}`}>
                      {paymentMethod === "HANDOVER" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 mb-1">Handover</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Meet on campus and pay in cash</p>
                </label>
              </div>

              {/* Form Container with Animation */}
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {paymentMethod === "BANK" && (
                  <BankDepositForm
                    onSubmit={handleBankDepositSubmit}
                    isProcessing={isProcessing}
                  />
                )}
                {paymentMethod === "CARD" && (
                  <CardPaymentForm
                    onSubmit={handleCardPaymentSubmit}
                    isProcessing={isProcessing}
                  />
                )}
                {paymentMethod === "HANDOVER" && (
                  <HandoverForm
                    onSubmit={handleHandoverSubmit}
                    isProcessing={isProcessing}
                    sellerLocation={product.location || "Campus"}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            
            {/* Card 1: Buyer Protection */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-emerald-500/10">
                <Shield size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Shield size={20} />
                  </div>
                  <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg`}>Buyer Protection</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  Your payment is securely held by Uni-Mart. We only release funds to the seller after you receive the item and confirm it matches the description.
                </p>
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold bg-white/60 backdrop-blur border border-emerald-200/60 p-3 rounded-xl shadow-sm">
                  <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500" />
                  <span>100% Money Back Guarantee</span>
                </div>
              </div>
            </div>

            {/* Card 2: Why Shop with Us? */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
              <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg mb-5`}>Why Shop with Us?</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 bg-blue-100 text-blue-600 rounded-full p-1"><CheckCircle size={14} /></div>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Verified Sellers</strong><br/>All sellers are campus verified</p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 bg-purple-100 text-purple-600 rounded-full p-1"><CheckCircle size={14} /></div>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Direct Chat</strong><br/>Communicate easily within the platform</p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 bg-amber-100 text-amber-600 rounded-full p-1"><CheckCircle size={14} /></div>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Flexible Payments</strong><br/>Card, bank transfer, or cash on meet</p>
                </div>
              </div>
            </div>

            {/* Ad Slider - Standalone 3D Look (object-fill forces 100% width and 100% height without any gaps or crop) */}
            <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] border border-white/40 group bg-gray-50">
              <a href="https://www.sliit.lk/" target="_blank" rel="noopener noreferrer" className="absolute inset-0 w-full h-full z-10 block">
                {AD_IMAGES.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Advertisement ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
                      index === currentAdIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  />
                ))}
              </a>
              
              {/* Decreasing progress bar */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20 z-20 backdrop-blur-sm">
                <div 
                  key={currentAdIndex} 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ animation: 'shrinkProgress 7s linear forwards' }}
                />
              </div>
            </div>
            {/* Inject keyframes for the progress bar animation */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes shrinkProgress {
                0% { width: 100%; }
                100% { width: 0%; }
              }
            `}} />

            {/* Card 3: Safe Handover Tips */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg`}>Safe Handover</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <MapPin size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Meet in well-lit, public campus areas like the main canteen.</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <Eye size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Inspect the item thoroughly before finalizing the payment.</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Quick FAQs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <HelpCircle size={20} />
                </div>
                <h3 className={`${oxanium.className} font-bold text-gray-900 text-lg`}>Quick FAQs</h3>
              </div>
              <div className="space-y-5">
                <div className="group">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5 group-hover:text-indigo-600 transition-colors">
                    <Clock size={14} className="text-indigo-400"/> How long does verification take?
                  </h4>
                  <p className="text-sm text-gray-500 pl-6 leading-relaxed">Bank deposit receipts are typically verified within 1-2 hours during working days.</p>
                </div>
                <div className="w-full h-px bg-gray-100"></div>
                <div className="group">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5 group-hover:text-indigo-600 transition-colors">
                    <LifeBuoy size={14} className="text-indigo-400"/> What if I cancel?
                  </h4>
                  <p className="text-sm text-gray-500 pl-6 leading-relaxed">You can cancel the order anytime before the seller accepts the handover or ships the item.</p>
                </div>
              </div>
            </div>

            {/* Card 5: Need Help? */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <LifeBuoy className="text-blue-500" size={24} />
                <h3 className="font-bold text-gray-900 text-lg">Need Assistance?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Having trouble with your checkout or need to report a suspicious listing?
              </p>
              <button className="w-full py-2.5 px-4 bg-blue-50 text-blue-600 rounded-xl font-semibold border border-blue-200 hover:bg-blue-100 transition shadow-sm">
                Contact Support
              </button>
            </div>

          </div>
        </div>
      </div>
      
    </div>
    <div className="w-[100vw] relative left-[50%] -translate-x-[50%] mt-12 bg-white">
       <Footer/> 
      </div>
    
    </div >
  );
} 
