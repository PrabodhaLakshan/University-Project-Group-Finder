"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getToken } from "@/lib/auth";

type CollaborationRow = {
  id: string;
  companyId: string;
  companyName: string;
  hasReview: boolean;
  isCompletionApproved: boolean;
  canReview: boolean;
};

export function MyCollaborationsView() {
  const [formCompany, setFormCompany] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formHover, setFormHover] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [collaborations, setCollaborations] = useState<CollaborationRow[]>([]);
  const [loadingCollaborations, setLoadingCollaborations] = useState(true);

  React.useEffect(() => {
    const loadCollaborations = async () => {
      const token = getToken();
      if (!token) {
        setLoadingCollaborations(false);
        return;
      }
      try {
        const res = await fetch("/api/startup-connect/collaborations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = (await res.json()) as { success?: boolean; data?: CollaborationRow[] };
        if (res.ok && json.success && Array.isArray(json.data)) {
          setCollaborations(json.data);
        }
      } catch {
        // Keep form usable; backend still enforces approval.
      } finally {
        setLoadingCollaborations(false);
      }
    };

    void loadCollaborations();
  }, []);

  const onSubmitForm = async () => {
    const token = getToken();
    if (!token) {
      setFormError("Please sign in first.");
      return;
    }
    const name = formCompany.trim();
    const comment = formComment.trim();
    if (!name || name.length < 2) {
      setFormError("Enter the exact registered company name.");
      return;
    }

    const matched = collaborations.find(
      (c) => c.companyName.trim().toLowerCase() === name.toLowerCase()
    );
    if (matched && !matched.canReview) {
      setFormError(
        matched.hasReview
          ? "You already submitted a review for this startup."
          : "You can review only after the startup marks your work as completed."
      );
      return;
    }

    if (!formRating) {
      setFormError("Choose a star rating (1–5).");
      return;
    }
    if (comment.length < 20 || comment.length > 500) {
      setFormError("Review must be 20–500 characters.");
      return;
    }
    setFormSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/startup-connect/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: name,
          rating: formRating,
          comment,
        }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setFormError(json.error ?? "Could not save review.");
        setFormSubmitting(false);
        return;
      }
      setFormCompany("");
      setFormComment("");
      setFormRating(0);
      setFormHover(0);
    } catch {
      setFormError("Network error. Try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50/70 via-white to-blue-50/40 pb-16 pt-6 sm:pb-24 sm:pt-10">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 relative">
        <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-60" />
        <div className="pointer-events-none absolute -bottom-14 -left-12 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60" />

       

        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-3xl">
            Work & <span className="text-orange-500">reviews</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm font-bold text-slate-500">
            Submit a review with the company name, rating, and feedback. Founders see it on their Startup
            Reviews dashboard.
          </p>
        </div>

        <div className="relative rounded-[1.75rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-white to-blue-50 p-6 shadow-[0_0_0_1px_rgba(249,115,22,0.18),0_18px_40px_rgba(2,132,199,0.14)] sm:p-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-200/30 via-white to-orange-200/30 opacity-95" />
          <div className="relative">
          <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Submit a review</h2>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Use the exact name the startup registered (same as on their profile)
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Company name
              </label>
              <Input
                value={formCompany}
                onChange={(e) => {
                  setFormCompany(e.target.value);
                  setFormError(null);
                }}
                placeholder="e.g. TechFlow Labs"
                className="rounded-2xl border-orange-200/70 bg-white py-5 text-sm font-bold focus:ring-2 focus:ring-orange-300"
              />
              {!loadingCollaborations && collaborations.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Your collaborations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {collaborations.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setFormCompany(c.companyName);
                          setFormError(null);
                        }}
                        className={`rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                          c.canReview
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : c.hasReview
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                        title={
                          c.canReview
                            ? "Approved - you can review"
                            : c.hasReview
                            ? "Already reviewed"
                            : "Waiting for startup completion approval"
                        }
                      >
                        {c.companyName}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    Green = can review, Yellow = waiting approval, Blue = already reviewed.
                  </p>
                </div>
              )}
            </div>

            <div>
              <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Rating
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setFormRating(star);
                      setFormError(null);
                    }}
                    onMouseEnter={() => setFormHover(star)}
                    onMouseLeave={() => setFormHover(0)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      size={36}
                      fill={(formHover || formRating) >= star ? "#f97316" : "transparent"}
                      className={(formHover || formRating) >= star ? "text-orange-500" : "text-slate-200"}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {formRating ? `Selected: ${formRating} / 5` : "Choose 1–5 stars"}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Your review
              </label>
              <Textarea
                value={formComment}
                onChange={(e) => {
                  setFormComment(e.target.value);
                  setFormError(null);
                }}
                placeholder="What was it like working with this startup? (20–500 characters)"
                className="min-h-35 rounded-2xl border-orange-200/70 bg-white p-4 text-sm font-medium focus:ring-2 focus:ring-orange-300"
              />
              <p className="mt-1 text-[10px] font-bold text-slate-400">{formComment.trim().length} / 500</p>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                {formError}
              </div>
            )}

            <Button
              type="button"
              disabled={formSubmitting}
              onClick={() => void onSubmitForm()}
              className="w-full rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-blue-600 py-6 font-black text-[10px] uppercase tracking-widest text-white hover:opacity-95 sm:w-auto sm:px-12 transition-colors shadow-lg shadow-orange-200/60"
            >
              {formSubmitting ? "Saving…" : "Submit review"}
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
