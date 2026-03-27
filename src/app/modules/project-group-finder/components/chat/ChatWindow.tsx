"use client";

import { useEffect, useRef } from "react";
import { useGroupChat } from "@/app/modules/project-group-finder/hooks/useGroupChat";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";

import { useAuth } from "@/app/providers";

export default function ChatWindow({
    groupId,
}: {
    groupId: string;
}) {
    const { user } = useAuth();
    const currentUserId = user?.id || "";
    const currentUserName = user?.name || "User";
    const currentUserImage = user?.avatar_path || "";
    const { messages, loading, sendMessage } = useGroupChat(groupId, currentUserId);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend({
        text,
        attachment,
    }: {
        text: string;
        attachment?: { kind: "image" | "video" | "voice"; file: File };
    }) {
        await sendMessage(text, currentUserName, currentUserImage, attachment);
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                Loading chat...
            </div>
        );
    }

    return (
        <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-lg font-semibold text-slate-800">Group Chat</h2>
            </div>

            <div 
                className="flex-1 space-y-3 overflow-y-auto p-4 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.85), rgba(248, 250, 252, 0.85)), url('/images/project-group-finder/group-finder-chat-background.jpg')`
                }}
            >
                {messages.length === 0 ? (
                    <p className="text-sm text-slate-500">No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwnMessage={msg.sender_id === currentUserId}
                        />
                    ))
                )}

                <div ref={bottomRef} />
            </div>

            <MessageInput onSend={handleSend} />
        </div>
    );
}
