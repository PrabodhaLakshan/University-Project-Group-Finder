"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, DollarSign, Clock, ArrowRight, Calendar, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApplyGigModal } from './ApplyGigModal';
import { getToken } from '@/lib/auth';

export type BrowseGigCard = {
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
  /** "Expected by" label derived safely (no deadline_at DB column). */
  expectedDeadline?: string;
  /** Short gig description used in cards */
  description?: string;
};

export const BrowseGigsView = () => {
  const [gigs, setGigs] = useState<BrowseGigCard[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [bookmarkBusyId, setBookmarkBusyId] = useState<string | null>(null);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);

  const [selectedGig, setSelectedGig] = useState<BrowseGigCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await fetch("/api/startup-connect/browse-gigs", { method: "GET" });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load gigs");
        }
        const list = Array.isArray(json.data) ? json.data : [];
        setGigs(list as BrowseGigCard[]);
      } catch (e) {
        console.error(e);
        setLoadError(e instanceof Error ? e.message : "Failed to load gigs");
        setGigs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadBookmarks = async () => {
      const token = getToken();
      if (!token) {
        setBookmarkedIds(new Set());
        return;
      }

      try {
        const res = await fetch('/api/startup-connect/bookmarks', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const json = await res.json();
        if (!res.ok || !json.success) return;

        const gigIds = Array.isArray(json.gigIds) ? json.gigIds : [];
        setBookmarkedIds(new Set(gigIds.filter((id): id is string => typeof id === 'string')));
      } catch {
        // Keep browsing usable even when bookmarks fail to load.
      }
    };

    loadBookmarks();
  }, []);

  const toggleBookmark = async (gigId: string) => {
    const token = getToken();
    if (!token) {
      setBookmarkError('Please login to save gigs.');
      return;
    }

    const isSaved = bookmarkedIds.has(gigId);
    setBookmarkBusyId(gigId);
    setBookmarkError(null);

    try {
      const res = await fetch('/api/startup-connect/bookmarks', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gigId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to update bookmark');
      }

      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) {
          next.delete(gigId);
        } else {
          next.add(gigId);
        }
        return next;
      });
    } catch (e) {
      setBookmarkError(e instanceof Error ? e.message : 'Bookmark update failed');
    } finally {
      setBookmarkBusyId(null);
    }
  };

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(gigs.map((g) => g.category)))],
    [gigs]
  );
  const types = useMemo(
    () => ['All', ...Array.from(new Set(gigs.map((g) => g.type)))],
    [gigs]
  );
  const levels = useMemo(
    () => ['All', ...Array.from(new Set(gigs.map((g) => g.level)))],
    [gigs]
  );

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
    const matchesType = selectedType === 'All' || gig.type === selectedType;
    const matchesLevel = selectedLevel === 'All' || gig.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesType && matchesLevel;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedLevel('All');
  };

  return (
    <div className="px-4 py-8 md:p-8 max-w-7xl mx-auto mt-16 md:mt-20 bg-white">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Find Your Next <span className="text-blue-700">Gig</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest italic">Browse projects from top campus startups</p>
          <Link
            href="/startup-connect/my-collaborations"
            className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
          >
            Finished a gig? Rate the startup <ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by Skill or Startup..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 rounded-2xl border-slate-100 bg-white shadow-sm font-bold text-xs"
            />
          </div>
          <Button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            variant="outline"
            className="rounded-2xl py-6 px-6 border-blue-100 bg-white hover:bg-blue-50"
          >
            <Filter size={18} className="text-blue-700" />
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="mb-8 rounded-3xl border border-red-100 bg-red-50 px-6 py-4 text-center text-xs font-bold text-red-700">
          {loadError}
        </div>
      )}

      {bookmarkError && (
        <div className="mb-8 rounded-3xl border border-orange-100 bg-orange-50 px-6 py-4 text-center text-xs font-bold text-orange-700">
          {bookmarkError}
        </div>
      )}

      {showFilters && (
        <div className="mb-8 p-5 rounded-3xl border border-slate-100 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
            >
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <Button
              type="button"
              onClick={clearFilters}
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-xs font-black uppercase"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 px-6 py-16 text-center">
          <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Loading gigs…</p>
        </div>
      ) : (
      <>
      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {filteredGigs.map((gig) => (
          <div
            key={gig.id}
            className="group relative bg-white rounded-xl sm:rounded-2xl md:rounded-[32px] lg:rounded-[40px] p-4 sm:p-5 md:p-6 lg:p-8 border border-slate-100 shadow-[0_18px_35px_rgba(15,23,42,0.10)] hover:shadow-[0_26px_70px_rgba(37,99,235,0.30)] transition-all hover:-translate-y-1.5 md:hover:-translate-y-2 border-b-4 border-b-blue-100 hover:border-b-orange-500 before:absolute before:-inset-1 before:rounded-[inherit] before:bg-linear-to-br before:from-blue-200/0 before:via-blue-200/60 before:to-orange-200/0 before:opacity-0 hover:before:opacity-100 before:-z-10 before:blur-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-50 text-blue-700 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
                {gig.category}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void toggleBookmark(gig.id)}
                  disabled={bookmarkBusyId === gig.id}
                  className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
                    bookmarkedIds.has(gig.id)
                      ? 'border-amber-300 bg-amber-100 text-amber-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-700'
                  } disabled:opacity-60`}
                >
                  <Bookmark size={12} className={bookmarkedIds.has(gig.id) ? 'fill-current' : ''} />
                  {bookmarkedIds.has(gig.id) ? 'Saved' : 'Save'}
                </button>
                <span className="text-orange-500 font-black text-[10px] uppercase italic">{gig.type}</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 uppercase leading-tight mb-1 group-hover:text-blue-700 transition-colors">
              {gig.title}
            </h3>
            {gig.description && (
              <p className="text-[11px] font-semibold text-slate-500 mb-3 line-clamp-3">
                {gig.description}
              </p>
            )}
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-5 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1">
                Company:
                <Link
                  href={`/startup-connect/${gig.startupId}`}
                  className="text-slate-600 underline cursor-pointer hover:text-blue-700 transition-colors"
                >
                  {gig.startup}
                </Link>
              </p>
              <span className="w-10 h-10 rounded-2xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                {gig.logoUrl ? (
                  <img
                    src={gig.logoUrl}
                    alt={`${gig.startup} logo`}
                    className="w-7 h-7 object-contain"
                  />
                ) : (
                  <span className="text-sm font-black text-slate-500">{gig.startup.charAt(0)}</span>
                )}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-emerald-100/80 bg-emerald-50/50 px-3 py-2.5 text-slate-800">
                <DollarSign size={16} className="shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700/90">Budget / price</p>
                  <p className="text-sm font-black tracking-tight text-slate-900">{gig.budget}</p>
                </div>
              </div>
              {gig.expectedDeadline && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Calendar size={14} className="text-blue-600 shrink-0" />
                  <span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight mr-1">
                      Expected by
                    </span>
                    {gig.expectedDeadline}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Clock size={14} className="text-orange-500" /> {gig.postedLabel}
              </div>
            </div>

            <Button 
              onClick={() => setSelectedGig(gig)}
              className="w-full bg-blue-50 hover:bg-orange-500 text-blue-700 hover:text-white rounded-2xl py-6 font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Apply Now <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        ))}
      </div>

      {filteredGigs.length === 0 && !loading && (
        <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 px-6 py-8 text-center">
          <p className="text-sm font-black text-slate-700 uppercase tracking-widest">No gigs found</p>
          <p className="text-xs font-bold text-slate-400 mt-2">
            {gigs.length === 0
              ? "No open gigs yet. Check back after startups post opportunities."
              : "Try changing filters or search terms."}
          </p>
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
      </>
      )}
    </div>
  );
};
