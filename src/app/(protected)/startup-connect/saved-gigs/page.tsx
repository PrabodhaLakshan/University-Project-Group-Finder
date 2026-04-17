"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Calendar, Clock, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/auth";
import { ApplyGigModal } from "@/app/modules/startup-connect/components/ApplyGigModal";

type BrowseGigCard = {
  id: string;
  title: string;
  startup: string;
  startupId: string;
  category: string;
  budget: string;
  type: string;
  level: string;
  postedLabel: string;
  logoUrl: string | null;
  expectedDeadline?: string;
  description?: string;
};

export default function SavedGigsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [allGigs, setAllGigs] = useState<BrowseGigCard[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedGig, setSelectedGig] = useState<BrowseGigCard | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = getToken();
        if (!token) {
          setError("Please login to view saved gigs.");
          setBookmarkedIds(new Set());
          setAllGigs([]);
          return;
        }

        const [bookmarksRes, gigsRes] = await Promise.all([
          fetch("/api/startup-connect/bookmarks", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch("/api/startup-connect/browse-gigs", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        const bookmarksJson = await bookmarksRes.json().catch(() => ({}));
        const gigsJson = await gigsRes.json().catch(() => ({}));

        if (!bookmarksRes.ok || !bookmarksJson.success) {
          throw new Error(bookmarksJson.error || "Failed to load saved gigs");
        }

        if (!gigsRes.ok || !gigsJson.success) {
          throw new Error(gigsJson.error || "Failed to load gigs");
        }

        const ids = Array.isArray(bookmarksJson.gigIds) ? bookmarksJson.gigIds : [];
        const gigRows = Array.isArray(gigsJson.data) ? gigsJson.data : [];

        setBookmarkedIds(new Set(ids.filter((id): id is string => typeof id === "string")));
        setAllGigs(gigRows as BrowseGigCard[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load saved gigs");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const savedGigs = useMemo(
    () => allGigs.filter((gig) => bookmarkedIds.has(gig.id)),
    [allGigs, bookmarkedIds]
  );

  const removeSavedGig = async (gigId: string) => {
    const token = getToken();
    if (!token) {
      setError("Please login to edit saved gigs.");
      return;
    }

    setBusyId(gigId);
    setError(null);

    try {
      const res = await fetch("/api/startup-connect/bookmarks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gigId }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to remove bookmark");
      }

      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(gigId);
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove bookmark");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_5%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(16,185,129,0.10),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%)] px-4 py-8 md:mt-20 md:p-8">
      <div className="mx-auto mt-16 max-w-7xl md:mt-0">
        <Link
          href="/startup-connect/browse-gigs"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm backdrop-blur hover:border-blue-300 hover:text-blue-700"
        >
          <ArrowLeft size={14} /> Back to Browse Gigs
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/3 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Opportunity Watchlist</p>
              <h1 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-slate-900 md:text-5xl">
                Saved <span className="text-blue-700">Gigs</span>
              </h1>
              <p className="mt-3 max-w-2xl text-xs font-bold uppercase tracking-wider text-slate-500 md:text-sm">
                Keep your favorite opportunities in one place and jump back when you are ready to apply.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm">
              <Bookmark size={16} className="fill-current" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Saved Count</p>
                <p className="text-lg font-black leading-none">{savedGigs.length}</p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-full bg-blue-200" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-600">Loading saved gigs...</p>
          </div>
        ) : savedGigs.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600">
              <Bookmark size={18} />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-slate-700">No saved gigs yet</p>
            <p className="mt-2 text-xs font-bold text-slate-400">
              Go to Browse Gigs and click Save on opportunities you want to track.
            </p>
            <Link
              href="/startup-connect/browse-gigs"
              className="mt-6 inline-flex rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-700 hover:bg-blue-100"
            >
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {savedGigs.map((gig) => (
              <article
                key={gig.id}
                className="group relative overflow-hidden rounded-[26px] border border-slate-200/70 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(37,99,235,0.18)]"
              >
                <div className="absolute -right-7 -top-7 h-16 w-16 rounded-full bg-blue-100/70 blur-xl transition-opacity group-hover:opacity-100" />

                <div className="relative mb-4 flex items-start justify-between gap-2">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-blue-700">
                    {gig.category}
                  </div>
                  <button
                    type="button"
                    disabled={busyId === gig.id}
                    onClick={() => void removeSavedGig(gig.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    <Trash2 size={12} /> {busyId === gig.id ? "Removing" : "Remove"}
                  </button>
                </div>

                <h2 className="relative text-lg font-black uppercase leading-tight text-slate-900">{gig.title}</h2>

                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-black text-slate-600">
                    {gig.startup?.charAt(0) || "S"}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{gig.startup}</p>
                </div>

                {gig.description && (
                  <p className="mt-3 line-clamp-3 text-[11px] font-semibold text-slate-500">{gig.description}</p>
                )}

                <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <DollarSign size={14} className="text-emerald-600" /> {gig.budget}
                  </div>
                  {gig.expectedDeadline && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Calendar size={14} className="text-blue-600" /> {gig.expectedDeadline}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Clock size={14} className="text-orange-500" /> {gig.postedLabel}
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setSelectedGig(gig)}
                    className="flex-1 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700"
                  >
                    Apply Now
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-slate-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                  >
                    <Link href="/startup-connect/browse-gigs">Browse</Link>
                  </Button>
                  <span className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-100 px-3 text-amber-700">
                    <Bookmark size={14} className="fill-current" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {selectedGig && (
          <ApplyGigModal
            gigId={selectedGig.id}
            gigTitle={selectedGig.title}
            startupName={selectedGig.startup}
            startupId={selectedGig.startupId}
            onClose={() => setSelectedGig(null)}
          />
        )}
      </div>
    </main>
  );
}
