"use client";
import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getToken } from '@/lib/auth';

export type NewReviewInput = {
  studentName: string;
  role: string;
  comment: string;
  rating: number;
};

export const AddReviewModal = ({
  onClose,
  onSubmit,
  companyId,
  onSuccess,
}: {
  onClose: () => void;
  /** Legacy local-only submit (dashboard preview). Prefer companyId + API. */
  onSubmit?: (review: NewReviewInput) => void;
  companyId?: string;
  onSuccess?: () => void;
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedComment = comment.trim();

    if (!rating) {
      setError('Please select a rating before submitting.');
      return;
    }

    if (trimmedComment.length < 20 || trimmedComment.length > 500) {
      setError('Please write 20-500 characters for your review.');
      return;
    }

    setError(null);

    if (companyId) {
      const token = getToken();
      if (!token) {
        setError('Please sign in to submit a review.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await fetch('/api/startup-connect/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ companyId, rating, comment: trimmedComment }),
        });
        const json = (await res.json()) as { success?: boolean; error?: string };
        if (!res.ok || !json.success) {
          setError(json.error ?? 'Could not submit review.');
          setSubmitting(false);
          return;
        }
        onSuccess?.();
        onClose();
      } catch {
        setError('Network error. Try again.');
        setSubmitting(false);
      }
      return;
    }

    if (onSubmit) {
      onSubmit({
        studentName: 'You',
        role: 'Student',
        comment: trimmedComment,
        rating,
      });
      onClose();
      return;
    }

    setError('Review form is not configured.');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black italic uppercase text-slate-900 leading-none">Write a <span className="text-orange-500">Review</span></h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Help others know about this startup</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-transparent hover:border-slate-100 text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
              {error}
            </div>
          )}

          {/* Rating Selector */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase mb-3">Overall Rating</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={32} 
                    fill={(hover || rating) >= star ? "#f97316" : "transparent"} 
                    className={(hover || rating) >= star ? "text-orange-500" : "text-slate-200"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Your Experience</label>
            <textarea 
              placeholder="Tell us about the team, the work environment, and the projects..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-32 bg-slate-50 border-none rounded-[24px] p-5 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-orange-500 outline-none resize-none placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-2xl py-6 font-black text-[10px] uppercase text-slate-400"
          >
            Cancel
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="flex-2 bg-orange-500 hover:bg-slate-900 text-white rounded-2xl py-6 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-100 disabled:opacity-60"
          >
            <Send className="w-3 h-3 mr-2" /> {submitting ? 'Submitting…' : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  );
};