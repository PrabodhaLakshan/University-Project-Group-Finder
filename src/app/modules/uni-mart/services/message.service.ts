import {
  Message,
  Conversation,
  ApiResponse,
  ConversationMessagesResponse,
} from "../types";
import { MessageFormData } from "../validations";
import { getToken } from "@/lib/auth";

const API_BASE = "/api/unimart";

const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface StartConversationInput {
  productId: string;
  sellerId?: string;
  orderId?: string;
}

export const startConversation = async (
  data: StartConversationInput
): Promise<{ id: string }> => {
  const response = await fetch(`${API_BASE}/chat/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to start conversation");
  }

  return response.json();
};

// Get conversations
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await fetch(`${API_BASE}/messages`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Failed to fetch conversations (${response.status})`);
  }

  return response.json();
};

// Get full conversation payload (metadata + messages)
export const getConversation = async (
  conversationId: string
): Promise<ConversationMessagesResponse> => {
  const response = await fetch(`${API_BASE}/messages/${conversationId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch messages");
  }

  return response.json();
};

// Send message
export const sendMessage = async (
  data: MessageFormData
): Promise<Message> => {
  const response = await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to send message");
  }

  return response.json();
};

// Mark message as read
export const markAsRead = async (
  conversationId: string
): Promise<ApiResponse<null>> => {
  const response = await fetch(`${API_BASE}/messages/${conversationId}/read`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) throw new Error("Failed to mark as read");
  return response.json();
};

// Get unread count
export const getUnreadCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE}/messages/unread-count`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) throw new Error("Failed to fetch unread count");
  const data = await response.json();
  return data.count;
};
