"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGroupChat } from "@/app/modules/project-group-finder/hooks/useGroupChat";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import type { GroupMessage, GroupMember } from "../../types/chat";

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
    const { messages, loading, sendMessage, deleteMessage } = useGroupChat(groupId, currentUserId);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [replyTo, setReplyTo] = useState<GroupMessage | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);

    useEffect(() => {
        // Fetch group members for @mentions
        const fetchMembers = async () => {
            if (!groupId) return;
            try {
                const token = localStorage.getItem("pgf_token");
                const res = await fetch(`/api/groups/${groupId}/members`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    setMembers(data.members || []);
                }
            } catch (err) {
                console.error("Failed to fetch group members", err);
            }
        };

        fetchMembers();
    }, [groupId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleReply = useCallback((msg: GroupMessage) => {
        setReplyTo(msg);
        // Focus the input maybe? We could pass a ref if needed, but just setting state is fine.
    }, []);

    const handleCancelReply = useCallback(() => {
        setReplyTo(null);
    }, []);

    const handleDelete = useCallback(async (msg: GroupMessage) => {
        if (msg.sender_id !== currentUserId) return;
        const confirmed = window.confirm("Delete this message?");
        if (!confirmed) return;
        await deleteMessage(msg.id);
    }, [currentUserId, deleteMessage]);

    async function handleSend({
        text,
        attachment,
        replyToId,
    }: {
        text: string;
        attachment?: { kind: "image" | "video" | "voice"; file: File };
        replyToId?: string;
    }) {
        await sendMessage(text, currentUserName, currentUserImage, attachment, replyToId);
        setReplyTo(null);
    }

    if (loading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500"></div>
                <p className="mt-4 text-sm font-medium text-slate-500">Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
            <div 
                className="flex-1 space-y-5 overflow-y-auto px-5 py-5 bg-cover bg-center bg-no-repeat scroll-smooth"
                style={{
                    backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.85), rgba(248, 250, 252, 0.85)), url('/images/project-group-finder/group-finder-chat-background.jpg')`
                }}
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <div className="bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-slate-200 text-center">
                            <p className="text-sm font-medium">No messages yet.</p>
                            <p className="text-xs mt-1">Send a message to start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwnMessage={msg.sender_id === currentUserId}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))
                )}

                <div ref={bottomRef} className="h-2" />
            </div>

            <MessageInput 
                onSend={handleSend} 
                replyTo={replyTo} 
                onCancelReply={handleCancelReply}
                members={members}
            />
        </div>
    );
}
