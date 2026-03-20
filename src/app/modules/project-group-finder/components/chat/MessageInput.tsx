"use client";

import { useState } from "react";

export default function MessageInput({
    onSend,
}: {
    onSend: (text: string) => void;
}) {
    const [text, setText] = useState("");

    function handleSend() {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    }

    return (
        <div className="flex gap-2 border-t border-slate-200 p-3">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend();
                    }
                }}
            />
            <button
                onClick={handleSend}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                Send
            </button>
        </div>
    );
}