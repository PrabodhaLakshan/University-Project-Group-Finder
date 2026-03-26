"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "../../services/product.service";
import { Product } from "../../types";
import { ArrowLeft, AlertCircle, HandshakeIcon, CreditCard, Banknote } from "lucide-react";
import BankDepositForm from "./components/BankDepositForm";
import CardPaymentForm from "./components/CardPaymentForm";
import HandoverForm, { HandoverDetails } from "./components/HandoverForm";
import { getToken } from "@/lib/auth";

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

  const handleBankDepositSubmit = async (receiptFile: File) => {
    if (!product) return;

    try {
      setIsProcessing(true);
      setError(null);
      const token = getToken();

      if (!token) {
        throw new Error("Please log in to continue checkout");
      }

      // Upload receipt and create order
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

      // Create card payment order (will return Stripe checkout URL)
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
      // Redirect to Stripe checkout
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

      // Create handover meeting order
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4">
            <div className="animate-spin w-8 h-8 border-3 border-blue-300 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-300/50 p-6 text-red-700">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-8 transition group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Secure Checkout
        </h1>
        <p className="text-gray-600">Complete your purchase with your preferred payment method</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-300/50 bg-red-500/10 backdrop-blur-md p-4 flex gap-3 text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-green-300/50 bg-green-500/10 backdrop-blur-md p-4 text-green-700 font-medium">
          ✓ {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="flex gap-4 pb-6 border-b border-white/40">
              {product.images[0] && (
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{product.category}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Condition: <span className="font-semibold text-gray-900">{product.condition}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Price</span>
                <span className="font-semibold text-gray-900">Rs. {product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/40">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="mt-6 pt-6 border-t border-white/40">
              <p className="text-sm text-gray-600 mb-3">Selling by</p>
              <div className="bg-blue-500/10 rounded-xl p-4">
                <p className="font-bold text-gray-900">{product.sellerName}</p>
                <p className="text-sm text-gray-600 mt-1">{product.sellerEmail}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

            <div className="space-y-3">
              {/* Bank Deposit Option */}
              <label className="flex items-start p-4 border-2 border-transparent rounded-xl cursor-pointer hover:bg-blue-500/5 transition group"
                style={{
                  borderColor: paymentMethod === "BANK" ? "#3b82f6" : "#e5e7eb",
                  backgroundColor: paymentMethod === "BANK" ? "rgba(59, 130, 246, 0.05)" : "transparent",
                }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK"
                  checked={paymentMethod === "BANK"}
                  onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
                  className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote size={20} className="text-blue-600" />
                    <p className="font-bold text-gray-900">Bank Deposit</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Transfer money to the seller's bank account and upload receipt for verification
                  </p>
                </div>
              </label>

              {/* Card Payment Option */}
              <label className="flex items-start p-4 border-2 border-transparent rounded-xl cursor-pointer hover:bg-green-500/5 transition group"
                style={{
                  borderColor: paymentMethod === "CARD" ? "#10b981" : "#e5e7eb",
                  backgroundColor: paymentMethod === "CARD" ? "rgba(16, 185, 129, 0.05)" : "transparent",
                }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
                  className="w-5 h-5 text-green-600 mt-1 flex-shrink-0"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={20} className="text-green-600" />
                    <p className="font-bold text-gray-900">Card Payment</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pay securely using credit/debit card through our secure payment gateway
                  </p>
                </div>
              </label>

              {/* Handover Option */}
              <label className="flex items-start p-4 border-2 border-transparent rounded-xl cursor-pointer hover:bg-purple-500/5 transition group"
                style={{
                  borderColor: paymentMethod === "HANDOVER" ? "#a855f7" : "#e5e7eb",
                  backgroundColor: paymentMethod === "HANDOVER" ? "rgba(168, 85, 247, 0.05)" : "transparent",
                }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="HANDOVER"
                  checked={paymentMethod === "HANDOVER"}
                  onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD" | "HANDOVER")}
                  className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <HandshakeIcon size={20} className="text-purple-600" />
                    <p className="font-bold text-gray-900">Handover (Pay on Meet)</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Meet the seller in person, inspect the item, and pay on the spot
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Payment Forms */}
          {paymentMethod === "BANK" && (
            <div className="mt-6">
              <BankDepositForm
                onSubmit={handleBankDepositSubmit}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {paymentMethod === "CARD" && (
            <div className="mt-6">
              <CardPaymentForm
                onSubmit={handleCardPaymentSubmit}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {paymentMethod === "HANDOVER" && (
            <div className="mt-6">
              <HandoverForm
                onSubmit={handleHandoverSubmit}
                isProcessing={isProcessing}
                sellerLocation={product.location || "Campus"}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 backdrop-blur-md rounded-2xl border border-blue-300/30 shadow-lg p-6 sticky top-24 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Why Shop with Us?</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700"><strong>Verified Sellers</strong> - All sellers are campus verified</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700"><strong>Authentic Products</strong> - Campus verified items only</span>
              </div>
              <div className="flex gap-3">
                <span className="text-purple-600 font-bold flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700"><strong>Direct Communication</strong> - Chat directly with sellers</span>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-600 font-bold flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700"><strong>Multiple Payment Options</strong> - Card, bank, or handover</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 font-bold flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700"><strong>Safe & Secure</strong> - Meet on campus in public</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
