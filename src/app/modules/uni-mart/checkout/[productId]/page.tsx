"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "../../services/product.service";
import { Product } from "../../types";
import { ArrowLeft, AlertCircle } from "lucide-react";
import BankDepositForm from "./components/BankDepositForm";
import CardPaymentForm from "./components/CardPaymentForm";
import { getToken } from "@/lib/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const productId = typeof params.productId === "string" ? params.productId : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CARD">("BANK");
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
        router.push("/uni-mart/purchase-history");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3 text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="flex gap-4 mb-6">
              {product.images[0] && (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{product.category}</p>
                <p className="text-gray-600 text-sm">
                  Condition: <span className="font-semibold">{product.condition}</span>
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold">Rs. {product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Selling by</p>
              <p className="font-semibold text-gray-900">{product.sellerName}</p>
              <p className="text-sm text-gray-600">{product.sellerEmail}</p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>

            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50"
                style={{
                  borderColor:
                    paymentMethod === "BANK" ? "#3b82f6" : undefined,
                  backgroundColor:
                    paymentMethod === "BANK" ? "#f0f9ff" : undefined,
                }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK"
                  checked={paymentMethod === "BANK"}
                  onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD")}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Bank Deposit</p>
                  <p className="text-sm text-gray-600">
                    Transfer money manually to seller's bank account and upload receipt
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50"
                style={{
                  borderColor:
                    paymentMethod === "CARD" ? "#10b981" : undefined,
                  backgroundColor:
                    paymentMethod === "CARD" ? "#f0fdf4" : undefined,
                }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={(e) => setPaymentMethod(e.target.value as "BANK" | "CARD")}
                  className="w-4 h-4 text-green-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Card Payment</p>
                  <p className="text-sm text-gray-600">
                    Pay securely using credit/debit card
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Payment Forms */}
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">About This Purchase</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span>
                <span>Secure & verified seller</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span>
                <span>Campus verified product</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span>
                <span>Direct communication with seller</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span>
                <span>Campus meetup recommended</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
