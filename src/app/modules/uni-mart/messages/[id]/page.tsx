"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getConversation,
  markAsRead,
  sendMessage,
} from "../../services/message.service";
import { Message } from "../../types";
import { ArrowLeft, Send } from "lucide-react";
import { getToken } from "@/lib/auth";

export default function SingleChatPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = useMemo(() => {
    try {
      const token = getToken();
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true);
    }

    try {
      setError(null);
      const payload = await getConversation(conversationId);
      setConversation(payload.conversation);
      setMessages(payload.messages);
      await markAsRead(conversationId);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for new messages
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadMessages({ silent: true });
    }, 3000);
    return () => window.clearInterval(interval);
  }, [loadMessages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) {
      return;
    }

    try {
      setIsSending(true);
      await sendMessage({
        conversationId,
        text: messageText.trim(),
      });
      setMessageText("");
      await loadMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Back to Messages
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">{conversation?.participantName || "User"}</h2>
          <p className="text-sm text-gray-600">{conversation?.productTitle || ""}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 pt-20">
              <p>No messages yet. Start the conversation.</p>
            </div>
          ) : (
            messages.map((message) => {
              const isMine = message.senderId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    <p
                      className={`text-[11px] mt-1 ${
                        isMine ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-6 py-2 bg-red-50 text-sm text-red-700 border-t border-red-200">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4 bg-white flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !messageText.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <Send size={16} />
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
