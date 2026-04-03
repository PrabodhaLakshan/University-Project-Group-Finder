"use client";

import type { GroupMessage } from "@/app/modules/project-group-finder/types/chat";
import { useState } from "react";
import { Reply, Play, Image as ImageIcon, Trash2 } from "lucide-react";
import MediaViewer from "./MediaViewer";

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
    onReply,
    onDelete,
}: {
    message: GroupMessage;
    isOwnMessage: boolean;
    onReply?: (msg: GroupMessage) => void;
    onDelete?: (msg: GroupMessage) => void;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const [viewingMedia, setViewingMedia] = useState<{ url: string; type: "image" | "video"; name: string | null } | null>(null);

    const senderImageSrc = message.sender_image ? resolveSenderImageUrl(message.sender_image) : "";
    const hasText = !!message.message?.trim();
    const hasAttachment = !!message.attachment_type && !!message.attachment_url;

    // A simple parser to highlight @mentions
    const renderText = (text: string) => {
        if (!text) return null;
        const words = text.split(" ");
        return words.map((word, i) => {
            if (word.startsWith("@") && word.length > 1) {
                return (
                    <span key={i} className="font-semibold text-blue-200 bg-blue-900/20 px-1 rounded mx-0.5">
                        {word}{" "}
                    </span>
                );
            }
            return <span key={i}>{word} </span>;
        });
    };

    return (
        <div className={`group flex ${isOwnMessage ? "justify-end" : "justify-start"} relative`}>
            
            <div
                className={`flex max-w-[80%] items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
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

                <div className={`relative flex flex-col group`}>
                    
                    {/* Reply button (appears on hover) */}
                    {onReply && (
                        <button
                            onClick={() => onReply(message)}
                            className={`absolute -top-3 ${isOwnMessage ? "-left-10" : "-right-10"} opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-white shadow-sm z-10`}
                            title="Reply"
                        >
                            <Reply className="h-4 w-4" />
                        </button>
                    )}
                    {isOwnMessage && onDelete && (
                        <button
                            onClick={() => onDelete(message)}
                            className="absolute -top-3 -right-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-red-50 border border-red-200 text-red-500 hover:text-red-600 hover:bg-white shadow-sm z-10"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}

                    <div
                        className={`rounded-2xl px-4 py-2.5 shadow-sm overflow-hidden relative ${
                            isOwnMessage
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-slate-200 text-slate-900"
                        }`}
                    >
                        {/* Render Reply Preview if exists */}
                        {message.reply_to_id && (
                            <div className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${isOwnMessage ? "bg-blue-700/50 border-blue-400 text-blue-100" : "bg-slate-50 border-blue-500 text-slate-600"}`}>
                                <p className={`font-semibold mb-0.5 ${isOwnMessage ? "text-blue-200" : "text-blue-600"}`}>
                                    {message.reply_to_sender || "Someone"}
                                </p>
                                <p className="truncate opacity-90 max-w-[200px]">
                                    {message.reply_to_message || "Attachment"}
                                </p>
                            </div>
                        )}

                        <p
                            className={`mb-1 text-[11px] font-bold tracking-wide uppercase ${
                                isOwnMessage ? "text-blue-200" : "text-slate-500"
                            }`}
                        >
                            {message.sender_name || "Unknown"}
                        </p>

                        {hasText && (
                            <p className="text-[15px] leading-snug whitespace-pre-wrap word-break break-words">
                                {isOwnMessage ? message.message : renderText(message.message)}
                            </p>
                        )}

                        {hasAttachment && message.attachment_type === "image" && (
                            <div 
                                className="mt-2 relative group/img cursor-pointer"
                                onClick={() => setViewingMedia({ url: message.attachment_url!, type: "image", name: message.attachment_name })}
                            >
                                <img
                                    src={message.attachment_url!}
                                    alt={message.attachment_name || "Chat image"}
                                    className="max-h-60 rounded-xl border border-white/20 object-cover shadow-sm transition group-hover/img:brightness-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition duration-200 bg-black/20 rounded-xl">
                                    <ImageIcon className="text-white h-8 w-8 drop-shadow-md" />
                                </div>
                            </div>
                        )}

                        {hasAttachment && message.attachment_type === "video" && (
                            <div 
                                className="mt-2 relative group/vid cursor-pointer bg-black rounded-xl overflow-hidden max-h-60"
                                onClick={() => setViewingMedia({ url: message.attachment_url!, type: "video", name: message.attachment_name })}
                            >
                                <video
                                    src={message.attachment_url!}
                                    className="max-h-60 w-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm group-hover/vid:bg-black/70 transition group-hover/vid:scale-110">
                                        <Play className="text-white h-6 w-6 ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {hasAttachment && message.attachment_type === "voice" && (
                            <audio controls src={message.attachment_url!} className={`mt-2 w-full max-w-[260px] ${isOwnMessage ? "invert opacity-90" : ""}`} />
                        )}

                        <div className={`mt-1.5 flex justify-end`}>
                            <p className={`text-[10px] uppercase font-medium tracking-wider ${isOwnMessage ? "text-blue-200" : "text-slate-400"}`}>
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {viewingMedia && (
                <MediaViewer 
                    url={viewingMedia.url} 
                    type={viewingMedia.type} 
                    name={viewingMedia.name} 
                    onClose={() => setViewingMedia(null)} 
                />
            )}
        </div>
    );
}
