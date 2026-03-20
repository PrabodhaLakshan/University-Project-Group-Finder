"use client";

import type { GroupMessage } from "@/app/modules/project-group-finder/types/chat";

import { useState } from "react";

export default function MessageBubble({
    message,
    isOwnMessage,
}: {
    message: GroupMessage;
    isOwnMessage: boolean;
}) {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <div
                className={`flex max-w-[75%] items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}
            >
                {message.sender_image && !imageFailed ? (
                    <img
                        src={message.sender_image.startsWith('http') || message.sender_image.startsWith('/')
                            ? message.sender_image
                            : `https://orinbntgsotpsarcvrga.supabase.co/storage/v1/object/public/avatars/${message.sender_image}`}
                        alt={message.sender_name || "User"}
                        className="flex-shrink-0 h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-white"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 shadow-sm ring-2 ring-white">
                        {message.sender_name
                            ? message.sender_name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "U"}
                    </div>
                )}

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