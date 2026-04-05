"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Mic, Plus, SendHorizontal, Square, Video, Image as ImageIcon, X, Reply } from "lucide-react";
import type { GroupMessage, GroupMember } from "../../types/chat";
import MentionPopup from "./MentionPopup";

type PendingAttachment = {
    kind: "image" | "video" | "voice";
    file: File;
    previewUrl?: string;
};

function findMentionSegmentLength(text: string, startIndex: number, members: GroupMember[]) {
    if (text[startIndex] !== "@") return 0;

    const remainingText = text.slice(startIndex);
    const sortedMembers = [...members].sort((a, b) => b.name.length - a.name.length);

    for (const member of sortedMembers) {
        const candidate = `@${member.name}`;
        if (
            remainingText.toLowerCase().startsWith(candidate.toLowerCase()) &&
            (remainingText.length === candidate.length || /\s/.test(remainingText[candidate.length] || ""))
        ) {
            return candidate.length;
        }
    }

    const partialMatch = remainingText.match(/^@[^\s]+(?:\s+[^\s]+)*/);
    return partialMatch?.[0]?.length || 0;
}

function renderHighlightedInput(text: string, members: GroupMember[]) {
    if (!text) return null;

    const parts: ReactNode[] = [];
    let cursor = 0;

    while (cursor < text.length) {
        const mentionLength = findMentionSegmentLength(text, cursor, members);

        if (mentionLength > 0) {
            const mentionText = text.slice(cursor, cursor + mentionLength);
            parts.push(
                <span
                    key={`${cursor}-${mentionText}`}
                    className="rounded-lg bg-blue-100 px-1.5 py-0.5 font-semibold text-blue-700"
                >
                    {mentionText}
                </span>
            );
            cursor += mentionLength;
            continue;
        }

        const nextMentionIndex = text.indexOf("@", cursor + 1);
        const end = nextMentionIndex === -1 ? text.length : nextMentionIndex;
        parts.push(
            <span key={`${cursor}-text`} className="text-slate-800">
                {text.slice(cursor, end)}
            </span>
        );
        cursor = end;
    }

    return parts;
}

export default function MessageInput({
    onSend,
    replyTo,
    onCancelReply,
    members = [],
}: {
    onSend: (payload: { text: string; attachment?: PendingAttachment; replyToId?: string }) => Promise<void> | void;
    replyTo?: GroupMessage | null;
    onCancelReply?: () => void;
    members?: GroupMember[];
}) {
    const [text, setText] = useState("");
    const [attachment, setAttachment] = useState<PendingAttachment | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Mentions state
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const [mentionIndex, setMentionIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (attachment?.previewUrl) {
                URL.revokeObjectURL(attachment.previewUrl);
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [attachment?.previewUrl]);

    // Handle detecting @ outside
    useEffect(() => {
        const lastAt = text.lastIndexOf("@");
        if (lastAt !== -1) {
            // Check if it's the start of a word (either beginning of text or space before)
            const isStartOfWord = lastAt === 0 || text[lastAt - 1] === " ";
            if (isStartOfWord) {
                const query = text.slice(lastAt + 1).toLowerCase();
                // Close popup if query has spaces (user kept typing a normal sentence)
                if (query.includes(" ")) {
                    setMentionQuery(null);
                } else {
                    setMentionQuery(query);
                    setMentionIndex(0); // Reset selection
                }
            } else {
                setMentionQuery(null);
            }
        } else {
            setMentionQuery(null);
        }
    }, [text]);

    const filteredMembers = (members || []).filter(m => 
        mentionQuery !== null && m.name.toLowerCase().includes(mentionQuery)
    );

    function handleMentionSelect(member: GroupMember) {
        if (mentionQuery === null) return;
        const lastAt = text.lastIndexOf("@");
        if (lastAt !== -1) {
            const before = text.slice(0, lastAt);
            const newText = before + `@${member.name} `;
            setText(newText);
            setMentionQuery(null);
            inputRef.current?.focus();
        }
    }

    function clearAttachment() {
        if (attachment?.previewUrl) {
            URL.revokeObjectURL(attachment.previewUrl);
        }
        setAttachment(null);
    }

    function setNewAttachment(next: PendingAttachment) {
        if (attachment?.previewUrl) {
            URL.revokeObjectURL(attachment.previewUrl);
        }
        setAttachment(next);
    }

    function handlePickFile(kind: "image" | "video", file: File) {
        const previewUrl = URL.createObjectURL(file);
        setNewAttachment({ kind, file, previewUrl });
    }

    async function startVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;
            mediaStreamRef.current = stream;
            chunksRef.current = [];
            setIsRecording(true);

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
                const previewUrl = URL.createObjectURL(blob);
                setNewAttachment({ kind: "voice", file, previewUrl });
                setIsRecording(false);

                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach((track) => track.stop());
                    mediaStreamRef.current = null;
                }
            };

            recorder.start();
        } catch (error) {
            console.error("Voice record start error:", error);
            setIsRecording(false);
        }
    }

    function stopVoiceRecording() {
        const recorder = mediaRecorderRef.current;
        if (!recorder || recorder.state === "inactive") return;
        recorder.stop();
    }

    async function handleSend() {
        const trimmed = text.trim();
        if (!trimmed && !attachment) return;

        try {
            setIsSending(true);
            await onSend({ 
                text: trimmed, 
                attachment: attachment || undefined,
                replyToId: replyTo?.id || undefined
            });
            setText("");
            clearAttachment();
            if (onCancelReply) onCancelReply();
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="border-t border-slate-200 bg-white p-4 pb-4">
            
            {/* Reply Banner */}
            {replyTo && (
                <div className="mb-3 flex items-start gap-3 rounded-2xl bg-blue-50/80 p-3 pr-10 relative border-l-4 border-blue-500 animate-in slide-in-from-bottom-2 fade-in duration-200 shadow-sm">
                    <Reply className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-blue-800 tracking-wide uppercase">
                            Replying to {replyTo.sender_name}
                        </p>
                        <p className="truncate text-sm text-slate-600 font-medium">
                            {replyTo.message || "Attachment"}
                        </p>
                    </div>
                    <button
                        onClick={onCancelReply}
                        className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-white hover:text-slate-800"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Attachment Preview */}
            {attachment && (
                <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm animate-in fade-in zoom-in duration-200">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {attachment.kind} attached
                        </p>
                        <button
                            type="button"
                            onClick={clearAttachment}
                            className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>

                    {attachment.kind === "image" && attachment.previewUrl && (
                        <img
                            src={attachment.previewUrl}
                            alt="Preview"
                            className="max-h-36 rounded-xl border border-slate-200 object-cover shadow-sm"
                        />
                    )}

                    {attachment.kind === "video" && attachment.previewUrl && (
                        <video
                            controls
                            src={attachment.previewUrl}
                            className="max-h-40 rounded-xl border border-slate-200 shadow-sm"
                        />
                    )}

                    {attachment.kind === "voice" && attachment.previewUrl && (
                        <audio controls src={attachment.previewUrl} className="w-full mt-2" />
                    )}
                </div>
            )}

            <div className="relative">
                {mentionQuery !== null && filteredMembers.length > 0 && (
                    <MentionPopup 
                        members={filteredMembers} 
                        query={mentionQuery}
                        selectedIndex={mentionIndex}
                        onSelect={handleMentionSelect}
                    />
                )}
                
                <div className="flex items-center gap-2 rounded-[28px] border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            title="Add image"
                        >
                            <ImageIcon className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-purple-50 hover:text-purple-600 hidden sm:grid"
                            title="Add video"
                        >
                            <Video className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="relative flex-1">
                        {text ? (
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 overflow-hidden px-3 py-2.5 text-[15px] font-medium leading-6 whitespace-pre"
                            >
                                {renderHighlightedInput(text, members)}
                            </div>
                        ) : null}

                        <input
                            ref={inputRef}
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message... (Use @ for mentions)"
                            className={`relative z-10 w-full bg-transparent px-3 py-2.5 text-[15px] font-medium outline-none placeholder:text-slate-400 placeholder:font-normal ${text ? "text-transparent caret-slate-800" : "text-slate-800"}`}
                            onKeyDown={(e) => {
                                if (mentionQuery !== null && filteredMembers.length > 0) {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        setMentionIndex(i => (i + 1) % filteredMembers.length);
                                        return;
                                    }
                                    if (e.key === "ArrowUp") {
                                        e.preventDefault();
                                        setMentionIndex(i => (i - 1 + filteredMembers.length) % filteredMembers.length);
                                        return;
                                    }
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleMentionSelect(filteredMembers[mentionIndex]);
                                        return;
                                    }
                                    if (e.key === "Escape") {
                                        setMentionQuery(null);
                                        return;
                                    }
                                }

                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                    </div>

                    {text.trim() || attachment ? (
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={isSending || isRecording}
                            className={`grid h-10 w-10 place-items-center rounded-full transition shadow-sm
                                ${isSending ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-105"}`}
                            title="Send"
                        >
                            <SendHorizontal className="h-5 w-5 ml-0.5" />
                        </button>
                    ) : !isRecording ? (
                        <button
                            type="button"
                            onClick={startVoiceRecording}
                            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-emerald-100 hover:text-emerald-600"
                            title="Record voice"
                        >
                            <Mic className="h-5 w-5" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={stopVoiceRecording}
                            className="grid h-10 w-10 place-items-center rounded-full bg-rose-500 text-white shadow-md animate-pulse hover:bg-rose-600"
                            title="Stop recording"
                        >
                            <Square className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePickFile("image", file);
                    e.currentTarget.value = "";
                }}
            />
            <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePickFile("video", file);
                    e.currentTarget.value = "";
                }}
            />
        </div>
    );
}
