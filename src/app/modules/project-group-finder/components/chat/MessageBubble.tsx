"use client";

import type { GroupMessage } from "@/app/modules/project-group-finder/types/chat";

export default function MessageBubble({
    message,
    isOwnMessage,
}: {
    message: GroupMessage;
    isOwnMessage: boolean;
}) {
    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <div
                className={`flex max-w-[75%] items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}
            >
                <img
                    src={message.sender_image || "/default-avatar.png"}
                    alt={message.sender_name || "User"}
                    className="h-9 w-9 rounded-full object-cover"
                />

                <div
                    className={`rounded-2xl px-4 py-2 shadow-sm ${isOwnMessage
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-900"
                        }`}
                >
                    <p
                        className={`mb-1 text-xs font-semibold ${isOwnMessage ? "text-blue-100" : "text-slate-500"
                            }`}
                    >
                        {message.sender_name || "Unknown User"}
                    </p>

                    <p className="text-sm">{message.message}</p>

                    <p
                        className={`mt-1 text-[11px] ${isOwnMessage ? "text-blue-100" : "text-slate-400"
                            }`}
                    >
                        {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
}