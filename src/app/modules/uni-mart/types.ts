// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  condition: "new" | "used" | "refurbished";
  location?: string;
  rating?: number;
  reviews?: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD"; // Transaction system
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  student_id: string;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
  rating?: number;
  totalSales?: number;
  createdAt: string;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productId: string;
  productTitle: string;
  productImage?: string | null;
  orderId?: string | null;
}

export interface ConversationMessagesResponse {
  conversation: {
    id: string;
    participantId: string;
    participantName: string;
    productId: string;
    productTitle: string;
    orderId?: string | null;
  };
  messages: Message[];
}

// Category Types
export interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Order Types (Transaction System)
export interface Order {
  id: string;
  product: Product;
  productId: string;
  buyer: User;
  buyerId: string;
  paymentMethod: "BANK" | "CARD"; // Bank Deposit or Card Payment
  paymentStatus: "PENDING" | "PAID" | "VERIFIED"; // PENDING -> VERIFIED (Bank) or PENDING -> PAID (Card)
  receiptUrl?: string; // For bank deposit receipt
  stripeSessionId?: string; // For card payment via Stripe
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
