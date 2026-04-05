"use client";
import React from "react";
import { Star, Quote } from "lucide-react";
import { getToken } from "@/lib/auth";

type ApiReview = {
  id: string;
  studentName: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
};

const COMPANY_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatReviewDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export const StartupReviews = () => {
  const [reviews, setReviews] = React.useState<ApiReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) {
        setError("Sign in as a startup to see your reviews.");
        setLoading(false);
        return;
      }
      try {
        const storedCompanyId =
          typeof window !== "undefined" ? localStorage.getItem("companyId")?.trim() ?? "" : "";
        const companyQs =
          storedCompanyId && COMPANY_UUID_RE.test(storedCompanyId)
            ? `?companyId=${encodeURIComponent(storedCompanyId)}`
            : "";
        const res = await fetch(`/api/startup-connect/reviews${companyQs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = (await res.json()) as { success?: boolean; data?: ApiReview[]; error?: string };
        if (cancelled) return;
        if (!res.ok || !json.success || !json.data) {
          setError(json.error ?? "Could not load reviews.");
          setReviews([]);
        } else {
          setReviews(json.data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load reviews.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-16 rounded-[40px] border border-sky-200/60 bg-gradient-to-br from-white via-sky-50/50 to-orange-50/30 p-10 shadow-[0_20px_60px_-18px_rgba(59,130,246,0.18)] ring-1 ring-sky-100/50">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-blue-600 via-orange-500 to-emerald-500 shadow-sm shadow-orange-200/40" />
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
            Startup <span className="text-orange-500">Reviews</span>
          </h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-600/80">
            What students say about working here
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 via-amber-50/80 to-white px-6 py-3 shadow-[0_10px_30px_-8px_rgba(234,88,12,0.2)] ring-1 ring-orange-100/60">
          <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {averageRating}
          </span>
          <div className="flex flex-col">
            <div className="flex text-amber-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={12} fill={i <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-[9px] font-black uppercase text-emerald-700/90">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-center text-sm font-bold text-sky-600">Loading reviews…</p>
      )}
      {error && !loading && (
        <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/60 px-6 py-8 text-center text-sm font-bold text-amber-950 shadow-inner ring-1 ring-amber-100/60">
          {error}
        </div>
      )}
      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-50/60 via-white to-emerald-50/40 px-6 py-10 text-center shadow-[0_12px_40px_-12px_rgba(16,185,129,0.12)] ring-1 ring-sky-100/50">
          <p className="text-sm font-black text-slate-800">No reviews yet</p>
          <p className="mx-auto mt-2 max-w-md text-xs font-medium text-slate-600">
            When students complete work with you, they can leave feedback on your public profile.
          </p>
        </div>
      )}
      {!loading && !error && reviews.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative overflow-hidden rounded-[32px] border border-sky-100/80 bg-gradient-to-br from-white via-sky-50/30 to-orange-50/20 p-8 shadow-[0_12px_40px_-12px_rgba(59,130,246,0.15)] ring-1 ring-sky-100/40 transition-all hover:border-orange-200/80 hover:shadow-[0_18px_50px_-10px_rgba(249,115,22,0.15)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-sky-200/30 to-orange-200/20 blur-2xl" />
              <Quote
                className="absolute right-6 top-6 text-sky-200/80 transition-colors group-hover:text-orange-200/90"
                size={40}
              />

              <div className="mb-4 flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-500 drop-shadow-sm" />
                ))}
              </div>

              <p className="relative mb-6 text-sm font-medium italic leading-relaxed text-slate-700">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="relative flex items-center justify-between border-t border-sky-100/80 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-xs font-black text-white shadow-md shadow-blue-300/30">
                    {review.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900">{review.studentName}</h4>
                    <p className="mt-0.5 w-fit rounded-full bg-blue-50/90 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-700 ring-1 ring-blue-100/80">
                      {review.role}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase text-emerald-600/90">
                  {formatReviewDate(review.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
