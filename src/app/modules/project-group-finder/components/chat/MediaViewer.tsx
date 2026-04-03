"use client";

import { X, Download } from "lucide-react";
import { useEffect } from "react";

export default function MediaViewer({
    url,
    type,
    name,
    onClose,
}: {
    url: string;
    type: "image" | "video";
    name?: string | null;
    onClose: () => void;
}) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm shadow-2xl">
            <div className="absolute top-4 right-4 flex gap-4 z-50">
                <a
                    href={url}
                    download={name || "download"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-slate-800/50 p-3 text-white transition hover:bg-slate-700 hover:scale-110 shadow-lg border border-white/10"
                    title="Download Media"
                >
                    <Download className="h-6 w-6" />
                </a>
                <button
                    onClick={onClose}
                    className="rounded-full bg-slate-800/50 p-3 text-white transition hover:bg-rose-500 hover:scale-110 shadow-lg border border-white/10"
                    title="Close Viewer"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div 
                className="relative max-h-full max-w-full overflow-hidden flex items-center justify-center animate-in fade-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {type === "image" ? (
                    <img 
                        src={url} 
                        alt={name || "Media view"} 
                        className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
                    />
                ) : (
                    <video 
                        src={url} 
                        controls 
                        autoPlay
                        className="max-h-[90vh] max-w-[95vw] rounded-xl shadow-2xl ring-1 ring-white/10"
                    />
                )}
            </div>
            {/* Click backdrop to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
