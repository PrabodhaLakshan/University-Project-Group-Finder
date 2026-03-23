"use client";
import React from 'react';
import { X, Send, Paperclip, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendApplicationNotification } from '../services/notification.service';

export const ApplyGigModal = ({
  gigTitle,
  startupName,
  startupId,
  onClose,
}: {
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

    setError(null);

    try {
      setSubmitting(true);
      await sendApplicationNotification({
        receiverId: startupId,
        gigTitle,
        startupName,
      });
      setSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch {
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black uppercase italic text-slate-900 leading-none">Application Sent!</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Your profile has been shared with the startup team. Good luck!
            </p>
          </div>
        ) : (
          <>
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black italic uppercase text-slate-900 leading-none tracking-tighter">Apply for <span className="text-sky-600">Gig</span></h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{gigTitle}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Why are you a good fit?</label>
                <textarea 
                  placeholder="Briefly explain your skills related to this project..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full h-32 bg-slate-50 border-none rounded-[24px] p-5 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-sky-500 outline-none resize-none placeholder:text-slate-300"
                />
              </div>

              <label className="p-4 border-2 border-dashed border-slate-100 rounded-[24px] flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all">
                <Paperclip size={16} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase">Attach Portfolio / CV (Required)</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.docx"
                  onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
                />
              </label>
              {attachment && (
                <p className="text-[10px] font-bold text-slate-500">Selected: {attachment.name}</p>
              )}
            </div>

            <div className="p-8 pt-0 flex gap-3">
              <Button variant="ghost" onClick={onClose} className="flex-1 rounded-2xl py-6 font-black text-[10px] uppercase text-slate-400 tracking-widest">Cancel</Button>
              <Button disabled={submitting} onClick={handleSubmit} className="flex-2 bg-sky-600 hover:bg-slate-900 text-white rounded-2xl py-6 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-sky-100">
                <Send className="w-3 h-3 mr-2" /> {submitting ? "Sending..." : "Send Application"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};