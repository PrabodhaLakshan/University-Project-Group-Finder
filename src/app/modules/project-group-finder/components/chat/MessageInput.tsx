"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Plus, SendHorizontal, Square, Video, Image as ImageIcon } from "lucide-react";

type PendingAttachment = {
    kind: "image" | "video" | "voice";
    file: File;
    previewUrl?: string;
};

export default function MessageInput({
    onSend,
}: {
    onSend: (payload: { text: string; attachment?: PendingAttachment }) => Promise<void> | void;
}) {
    const [text, setText] = useState("");
    const [attachment, setAttachment] = useState<PendingAttachment | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isSending, setIsSending] = useState(false);

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
            await onSend({ text: trimmed, attachment: attachment || undefined });
            setText("");
            clearAttachment();
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="border-t border-slate-200 bg-white/90 p-3 backdrop-blur">
            {attachment && (
                <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {attachment.kind} attached
                        </p>
                        <button
                            type="button"
                            onClick={clearAttachment}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                            Remove
                        </button>
                    </div>

                    {attachment.kind === "image" && attachment.previewUrl && (
                        <img
                            src={attachment.previewUrl}
                            alt="Attachment preview"
                            className="max-h-36 rounded-lg border border-slate-200 object-cover"
                        />
                    )}

                    {attachment.kind === "video" && attachment.previewUrl && (
                        <video
                            controls
                            src={attachment.previewUrl}
                            className="max-h-40 rounded-lg border border-slate-200"
                        />
                    )}

                    {attachment.kind === "voice" && attachment.previewUrl && (
                        <audio controls src={attachment.previewUrl} className="w-full" />
                    )}
                </div>
            )}

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Add image"
                        aria-label="Add image"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        title="Image"
                        aria-label="Image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        title="Video"
                        aria-label="Video"
                    >
                        <Video className="h-4 w-4" />
                    </button>
                </div>

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent px-2 py-2 text-slate-700 outline-none placeholder:text-slate-400"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />

                {text.trim() || attachment ? (
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={isSending || isRecording}
                        className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Send message"
                        aria-label="Send message"
                    >
                        <SendHorizontal className="h-4 w-4" />
                    </button>
                ) : !isRecording ? (
                    <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600"
                        title="Record voice"
                        aria-label="Record voice"
                    >
                        <Mic className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="grid h-10 w-10 place-items-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
                        title="Stop recording"
                        aria-label="Stop recording"
                    >
                        <Square className="h-4 w-4" />
                    </button>
                )}
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
