import { Order, ApiResponse } from "../types";
import { OrderFormData, BankDepositFormData, CardPaymentFormData } from "../validations";
import { getToken } from "@/lib/auth";

const API_BASE = "/api/unimart";

// Create a new order (initial state: PENDING)
export const createOrder = async (data: {
  productId: string;
  paymentMethod: "BANK" | "CARD";
  receiptUrl?: string;
  stripeSessionId?: string;
}): Promise<Order> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create order");
  }
  
  return response.json();
};

// Get all orders for the current user (buyer)
export const getUserOrders = async (): Promise<Order[]> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/orders`, {
    headers: {
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error("Failed to fetch orders");
  
  return response.json();
};

// Get a single order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/orders/${orderId}`, {
    headers: {
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error("Failed to fetch order");
  
  return response.json();
};

// Upload receipt and create bank deposit order
export const createBankDepositOrder = async (
  productId: string,
  receiptFile: File
): Promise<Order> => {
  const token = getToken();
  
  const formData = new FormData();
  formData.append("productId", productId);
  formData.append("paymentMethod", "BANK");
  formData.append("receipt", receiptFile);
  
  const response = await fetch(`${API_BASE}/orders/bank-deposit`, {
    method: "POST",
    headers: {
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create bank deposit order");
  }
  
  return response.json();
};

// Create card payment order (Stripe)
export const createCardPaymentOrder = async (
  productId: string,
  cardDetails: {
    cardholderName: string;
    email: string;
    phone: string;
  }
): Promise<{ order: Order; checkoutUrl: string }> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/orders/card-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify({
      productId,
      paymentMethod: "CARD",
      ...cardDetails,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create card payment order");
  }
  
  return response.json();
};

// Verify bank deposit (admin/seller verify receipt)
export const verifyBankDeposit = async (
  orderId: string
): Promise<Order> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/orders/${orderId}/verify`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify({ paymentStatus: "VERIFIED" }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to verify order");
  }
  
  return response.json();
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  paymentStatus: "PENDING" | "PAID" | "VERIFIED"
): Promise<Order> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify({ paymentStatus }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update order");
  }
  
  return response.json();
};

// Get product order history (for sellers to see who bought their item)
export const getProductOrders = async (productId: string): Promise<Order[]> => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/products/${productId}/orders`, {
    headers: {
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error("Failed to fetch product orders");
  
  return response.json();
};
