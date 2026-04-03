// "use client";

// import { useState, useEffect, useMemo, useRef, useCallback } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   getConversation,
//   markAsRead,
//   sendMessage,
// } from "../../services/message.service";
// import { Message } from "../../types";
// import { ArrowLeft, Send } from "lucide-react";
// import { getToken } from "@/lib/auth";

// export default function SingleChatPage() {
//   const router = useRouter();
//   const params = useParams();
//   const conversationId = params.id as string;

//   const [conversation, setConversation] = useState<any>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [messageText, setMessageText] = useState("");

//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   const currentUserId = useMemo(() => {
//     try {
//       const token = getToken();
//       if (!token) return null;
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.userId || payload.sub || null;
//     } catch {
//       return null;
//     }
//   }, []);

//   const scrollToBottom = () => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const loadMessages = useCallback(async (options?: { silent?: boolean }) => {
//     if (!options?.silent) {
//       setIsLoading(true);
//     }

//     try {
//       setError(null);
//       const payload = await getConversation(conversationId);
//       setConversation(payload.conversation);
//       setMessages(payload.messages);
//       await markAsRead(conversationId);
//     } catch (err) {
//       console.error("Failed to load messages:", err);
//       setError(err instanceof Error ? err.message : "Failed to load messages");
//     } finally {
//       if (!options?.silent) {
//         setIsLoading(false);
//       }
//     }
//   }, [conversationId]);

//   useEffect(() => {
//     loadMessages();
//   }, [loadMessages]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Polling for new messages
//   useEffect(() => {
//     const interval = window.setInterval(() => {
//       loadMessages({ silent: true });
//     }, 3000);
//     return () => window.clearInterval(interval);
//   }, [loadMessages]);

//   const handleSendMessage = async () => {
//     if (!messageText.trim() || isSending) {
//       return;
//     }

//     try {
//       setIsSending(true);
//       await sendMessage({
//         conversationId,
//         text: messageText.trim(),
//       });
//       setMessageText("");
//       await loadMessages();
//     } catch (err) {
//       console.error("Failed to send message:", err);
//       setError(err instanceof Error ? err.message : "Failed to send message");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-500">Loading chat...</p>
//       </div>
//     );
//   }

//   if (error && !conversation) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
//           <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => router.back()}
//             className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
//       >
//         <ArrowLeft size={20} />
//         Back to Messages
//       </button>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-140px)] flex flex-col">
//         {/* Header */}
//         <div className="border-b px-6 py-4 bg-gray-50">
//           <h2 className="text-xl font-semibold text-gray-900">{conversation?.participantName || "User"}</h2>
//           <p className="text-sm text-gray-600">{conversation?.productTitle || ""}</p>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4">
//           {messages.length === 0 ? (
//             <div className="text-center text-gray-500 pt-20">
//               <p>No messages yet. Start the conversation.</p>
//             </div>
//           ) : (
//             messages.map((message) => {
//               const isMine = message.senderId === currentUserId;
//               return (
//                 <div
//                   key={message.id}
//                   className={`flex ${isMine ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
//                       isMine
//                         ? "bg-blue-600 text-white rounded-br-none"
//                         : "bg-white text-gray-900 rounded-bl-none"
//                     }`}
//                   >
//                     <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
//                     <p
//                       className={`text-[11px] mt-1 ${
//                         isMine ? "text-blue-100" : "text-gray-500"
//                       }`}
//                     >
//                       {new Date(message.createdAt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* Error banner */}
//         {error && (
//           <div className="px-6 py-2 bg-red-50 text-sm text-red-700 border-t border-red-200">
//             {error}
//           </div>
//         )}

//         {/* Input */}
//         <div className="border-t p-4 bg-white flex gap-2">
//           <input
//             type="text"
//             value={messageText}
//             onChange={(e) => setMessageText(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//             placeholder="Type your message..."
//             className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={isSending || !messageText.trim()}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
//           >
//             <Send size={16} />
//             {isSending ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Oxanium } from "next/font/google";
import {
  getConversation,
  markAsRead,
  sendMessage,
} from "../../services/message.service";
import { Message } from "../../types";
import { ArrowLeft, Send, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { getToken } from "@/lib/auth";

// Initialize Oxanium font
const oxanium = Oxanium({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"] 
});

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
      <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 ${oxanium.className}`}>
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading conversation...</p>
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className={`min-h-[60vh] flex flex-col items-center justify-center p-4 ${oxanium.className}`}>
        <div className="bg-white border border-red-100 rounded-3xl p-10 text-center max-w-md shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load chat</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto pb-6 ${oxanium.className}`}>
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors mb-6 w-fit"
      >
        <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
          <ArrowLeft size={16} />
        </div>
        Back to Messages
      </button>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden h-[calc(100vh-160px)] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 bg-white flex items-center gap-4 shrink-0 z-10 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
            {conversation?.participantName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {conversation?.participantName || "User"}
            </h2>
            <p className="text-sm text-gray-500 truncate font-medium">
              {conversation?.productTitle || "Product Discussion"}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="text-blue-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No messages yet</h3>
              <p className="text-gray-500 text-sm">Send a message to start the conversation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isMine = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"} group animate-in slide-in-from-bottom-2 fade-in duration-300`}
                  >
                    <div
                      className={`max-w-[75%] md:max-w-[60%] px-5 py-3 shadow-sm relative ${
                        isMine
                          ? "bg-blue-600 text-white rounded-3xl rounded-tr-sm"
                          : "bg-white text-gray-900 border border-gray-100 rounded-3xl rounded-tl-sm"
                      }`}
                    >
                      <p className="text-[15px] whitespace-pre-wrap break-words leading-relaxed">
                        {message.text}
                      </p>
                      <div
                        className={`text-[11px] mt-2 font-medium flex items-center justify-end gap-1 ${
                          isMine ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={bottomRef} className="h-1" />
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-6 py-3 bg-red-50 text-sm font-medium text-red-700 border-t border-red-100 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-2xl pl-5 pr-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none max-h-32 text-sm font-medium text-gray-900 placeholder:text-gray-400"
                rows={1}
                style={{ minHeight: "52px" }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isSending || !messageText.trim()}
              className="h-[52px] px-6 rounded-2xl bg-blue-600 text-white font-bold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              {isSending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Send</span>
                  <Send size={18} className="translate-x-0.5" />
                </>
              )}
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[11px] font-medium text-gray-400">Press Enter to send, Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}