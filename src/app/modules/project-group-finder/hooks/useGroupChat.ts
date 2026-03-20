"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import type { GroupMessage } from "@/app/modules/project-group-finder/types/chat";

export function useGroupChat(groupId: string, currentUserId: string) {
    const [messages, setMessages] = useState<GroupMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHistory() {
            try {
                const res = await fetch(`/api/groups/${groupId}/messages`);
                const data = await res.json();

                if (data.success) {
                    setMessages(data.messages || []);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            } finally {
                setLoading(false);
            }
        }

        if (groupId) {
            loadHistory();
        }
    }, [groupId]);

    useEffect(() => {
        if (!groupId) return;

        const socket = getSocket();

        socket.emit("join_group", groupId);

        const handleReceiveMessage = (message: GroupMessage) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [groupId]);

    async function sendMessage(text: string, senderName?: string, senderImage?: string) {
        const trimmed = text.trim();
        if (!trimmed) return;

        try {
            const res = await fetch(`/api/groups/${groupId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender_id: currentUserId,
                    sender_name: senderName || null,
                    sender_image: senderImage || null,
                    message: trimmed,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                console.error("Failed to save message");
                return;
            }

            const savedMessage: GroupMessage = data.message;

            const socket = getSocket();
            socket.emit("send_message", {
                groupId,
                message: savedMessage,
            });
        } catch (error) {
            console.error("Send message error:", error);
        }
    }

    return {
        messages,
        loading,
        sendMessage,
    };
}