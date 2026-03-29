"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import type { GroupMessage } from "@/app/modules/project-group-finder/types/chat";

type SendAttachment = {
    kind: "image" | "video" | "voice";
    file: File;
};

export function useGroupChat(groupId: string, currentUserId: string) {
    const [messages, setMessages] = useState<GroupMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHistory() {
            try {
                const token = localStorage.getItem("pgf_token");
                const headers: HeadersInit = token
                    ? { Authorization: `Bearer ${token}` }
                    : {};
                const securedRes = await fetch(`/api/groups/${groupId}/messages`, { headers });
                const data = await securedRes.json();

                if (securedRes.ok && data.success) {
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

        const handleMessageDeleted = ({ messageId }: { messageId?: string }) => {
            if (!messageId) return;
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_deleted", handleMessageDeleted);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_deleted", handleMessageDeleted);
        };
    }, [groupId]);

    async function sendMessage(
        text: string,
        senderName?: string,
        senderImage?: string,
        attachment?: SendAttachment,
        replyToId?: string
    ) {
        const trimmed = text.trim();
        if (!trimmed && !attachment) return;

        try {
            const token = localStorage.getItem("pgf_token");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            let uploadedAttachment:
                | {
                    kind: "image" | "video" | "voice";
                    name: string;
                    bucket: string;
                    path: string;
                    signedUrl: string | null;
                }
                | null = null;

            if (attachment) {
                const formData = new FormData();
                formData.append("file", attachment.file);
                formData.append("kind", attachment.kind);

                const uploadHeaders: HeadersInit = token
                    ? { Authorization: `Bearer ${token}` }
                    : {};

                const uploadRes = await fetch(`/api/groups/${groupId}/messages/upload`, {
                    method: "POST",
                    headers: uploadHeaders,
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok || !uploadData.success) {
                    console.error(uploadData.error || "Failed to upload attachment");
                    return;
                }

                uploadedAttachment = uploadData.attachment;
            }

            const res = await fetch(`/api/groups/${groupId}/messages`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    sender_id: currentUserId,
                    sender_name: senderName || null,
                    sender_image: senderImage || null,
                    message: trimmed,
                    attachment_type: uploadedAttachment?.kind || null,
                    attachment_bucket: uploadedAttachment?.bucket || null,
                    attachment_path: uploadedAttachment?.path || null,
                    attachment_name: uploadedAttachment?.name || null,
                    reply_to_id: replyToId || null,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                console.error(data.message || "Failed to save message");
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

    async function deleteMessage(messageId: string) {
        const trimmedId = messageId.trim();
        if (!trimmedId) return false;

        try {
            const token = localStorage.getItem("pgf_token");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            const res = await fetch(`/api/groups/${groupId}/messages`, {
                method: "DELETE",
                headers,
                body: JSON.stringify({ message_id: trimmedId }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                console.error(data.message || "Failed to delete message");
                return false;
            }

            setMessages((prev) => prev.filter((msg) => msg.id !== trimmedId));

            const socket = getSocket();
            socket.emit("delete_message", { groupId, messageId: trimmedId });
            return true;
        } catch (error) {
            console.error("Delete message error:", error);
            return false;
        }
    }

    return {
        messages,
        loading,
        sendMessage,
        deleteMessage,
    };
}
