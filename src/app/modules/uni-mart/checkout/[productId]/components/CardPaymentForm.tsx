"use client";

import { useState } from "react";
import { CreditCard, AlertCircle } from "lucide-react";

interface CardPaymentFormProps {
  onSubmit: (details: CardDetails) => Promise<void>;
  isProcessing: boolean;
}

interface CardDetails {
  cardholderName: string;
  email: string;
  phone: string;
}

export default function CardPaymentForm({
  onSubmit,
  isProcessing,
}: CardPaymentFormProps) {
  const [formData, setFormData] = useState<CardDetails>({
    cardholderName: "Demo Student",
    email: "demo.student@uninexus.test",
    phone: "0712345678",
  });
  const [errors, setErrors] = useState<Partial<CardDetails>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CardDetails, boolean>>>({});

  const validateForm = () => {
    const newErrors: Partial<CardDetails> = {};

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name as keyof CardDetails]) {
      validateField(name as keyof CardDetails, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name as keyof CardDetails, value);
  };

  const validateField = (field: keyof CardDetails, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "cardholderName":
        if (!value.trim()) {
          newErrors.cardholderName = "Cardholder name is required";
        } else {
          delete newErrors.cardholderName;
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        const phoneDigits = value.replace(/\D/g, "");
        if (!phoneDigits) {
          newErrors.phone = "Phone number is required";
        } else if (phoneDigits.length < 10) {
          newErrors.phone = "Phone number must be at least 10 digits";
        } else {
          delete newErrors.phone;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Card Payment Details
      </h2>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
        <AlertCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-900">
          <p className="font-semibold mb-1">Demo Mode:</p>
          <p>
            Checkout uses demo data only. The fields below are sample values for
            testing and do not represent a real card payment.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name *
          </label>
          <input
            id="cardholderName"
            type="text"
            name="cardholderName"
            value={formData.cardholderName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Demo Student"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.cardholderName && errors.cardholderName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            disabled={isProcessing}
          />
          {touched.cardholderName && errors.cardholderName && (
            <p className="text-red-600 text-sm mt-1">{errors.cardholderName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="demo.student@uninexus.test"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.email && errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            disabled={isProcessing}
          />
          {touched.email && errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0712345678"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.phone && errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            disabled={isProcessing}
          />
          {touched.phone && errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
          <CreditCard size={16} className="flex-shrink-0 mt-0.5" />
          <p>
            Your card details will NOT be stored. You will be securely redirected
            to Stripe for payment processing.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || Object.keys(errors).length > 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <CreditCard size={20} />
          {isProcessing ? "Processing..." : "Proceed to Stripe Checkout"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        This is a demo checkout flow. Use only sample/test details.
      </p>
    </form>
  );
}
