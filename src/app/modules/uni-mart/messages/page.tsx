"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getConversations } from "../services/message.service";
import { Conversation } from "../types";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MessagesListPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load conversations";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Polling for new messages
  useEffect(() => {
    const interval = window.setInterval(() => {
      loadConversations();
    }, 5000);
    return () => window.clearInterval(interval);
  }, [loadConversations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <MessageCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Messages</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Messages</h2>
        <p className="text-gray-600 mb-6">
          Start browsing items and send messages to sellers
        </p>
        <Link
          href="/uni-mart"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
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
        Back
      </button>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="grid gap-4 max-w-3xl">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/modules/uni-mart/messages/${conv.id}`}
          >
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {conv.participantName}
                  </h3>
                  <p className="text-sm font-medium text-gray-700">
                    {conv.productTitle}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 ml-2">
                    {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {conv.lastMessage || "No messages yet"}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {new Date(conv.lastMessageTime).toLocaleDateString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {conv.productImage && (
                  <img
                    src={conv.productImage}
                    alt={conv.productTitle}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
