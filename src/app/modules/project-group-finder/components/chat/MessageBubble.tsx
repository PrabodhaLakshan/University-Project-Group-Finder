"use client";

import type { GroupMessage } from "@/app/modules/project-group-finder/types/chat";

import { useState } from "react";

function resolveSenderImageUrl(senderImage: string) {
    const raw = senderImage.trim();
    if (!raw) return "";

    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
        return raw;
    }

    const normalizedPath = raw.replace(/\\/g, "/").replace(/^avatars\//, "");
    const supabaseBase =
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://orinbntgsotpsarcvrga.supabase.co";

    return `${supabaseBase}/storage/v1/object/public/avatars/${normalizedPath}`;
}

export default function MessageBubble({
    message,
    isOwnMessage,
}: {
    message: GroupMessage;
    isOwnMessage: boolean;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const senderImageSrc = message.sender_image ? resolveSenderImageUrl(message.sender_image) : "";
    const hasText = !!message.message?.trim();
    const hasAttachment = !!message.attachment_type && !!message.attachment_url;

    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <div
                className={`flex max-w-[75%] items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}
            >
                {senderImageSrc && !imageFailed ? (
                    <img
                        src={senderImageSrc}
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

                    {hasText && <p className="text-sm">{message.message}</p>}

                    {hasAttachment && message.attachment_type === "image" && (
                        <img
                            src={message.attachment_url!}
                            alt={message.attachment_name || "Chat image"}
                            className="mt-2 max-h-56 rounded-xl border border-white/20 object-cover"
                        />
                    )}

                    {hasAttachment && message.attachment_type === "video" && (
                        <video
                            controls
                            src={message.attachment_url!}
                            className="mt-2 max-h-64 rounded-xl border border-white/20"
                        />
                    )}

                    {hasAttachment && message.attachment_type === "voice" && (
                        <audio controls src={message.attachment_url!} className="mt-2 w-full max-w-[280px]" />
                    )}

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
