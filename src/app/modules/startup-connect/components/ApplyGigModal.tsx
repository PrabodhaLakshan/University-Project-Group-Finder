"use client";
import React from "react";
import { X, Send, Paperclip, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/auth";

export const ApplyGigModal = ({
  gigId,
  gigTitle,
  startupName,
  startupId,
  onClose,
}: {
  gigId: string;
  gigTitle: string;
  startupName: string;
  startupId: string;
  onClose: () => void;
}) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [motivation, setMotivation] = React.useState("");
  const [attachment, setAttachment] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleSubmit = async () => {
    const trimmedMotivation = motivation.trim();

    if (trimmedMotivation.length < 20 || trimmedMotivation.length > 500) {
      setError("Please write 20-500 characters about why you are a good fit.");
      return;
    }

    if (!attachment) {
      setError("Please attach your CV or portfolio before submitting.");
      return;
    }

    if (attachment && (attachment.size > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(attachment.type))) {
      setError("Attachment must be PDF/JPG/PNG/WEBP/DOCX and 5MB or smaller.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Please sign in to apply.");
      return;
    }

    setError(null);

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("motivation", trimmedMotivation);
      fd.append("resume", attachment);

      const res = await fetch(`/api/startup-connect/gigs/${gigId}/applications`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const result = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !result.success) {
        setError(result.error || "Could not submit application.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md animate-in overflow-hidden rounded-[40px] bg-white shadow-2xl fade-in zoom-in duration-300">
        {submitted ? (
          <div className="space-y-4 p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase italic leading-none text-slate-900">Application Sent!</h3>
            <p className="text-xs font-bold uppercase leading-relaxed tracking-widest text-slate-400">
              Your profile has been shared with the startup team. Good luck!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 p-8">
              <div>
                <h3 className="text-xl font-black leading-none tracking-tighter text-slate-900">
                  Apply for <span className="text-sky-600">Gig</span>
                </h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{gigTitle}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-8">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Why are you a good fit?
                </label>
                <textarea
                  placeholder="Briefly explain your skills related to this project..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="h-32 w-full resize-none rounded-[24px] border-none bg-slate-50 p-5 text-xs font-bold text-slate-600 outline-none placeholder:text-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-slate-100 p-4 transition-all hover:bg-slate-50">
                <Paperclip size={16} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase text-slate-400">Attach Portfolio / CV (Required)</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.docx"
                  onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
                />
              </label>
              {attachment && <p className="text-[10px] font-bold text-slate-500">Selected: {attachment.name}</p>}
            </div>

            <div className="flex gap-3 p-8 pt-0">
              <Button
                variant="ghost"
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl py-6 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={() => void handleSubmit()}
                className="flex-2 rounded-2xl bg-sky-600 py-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-sky-100 transition-all hover:bg-slate-900"
              >
                <Send className="mr-2 inline w-3 h-3" /> {submitting ? "Sending..." : "Send Application"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
