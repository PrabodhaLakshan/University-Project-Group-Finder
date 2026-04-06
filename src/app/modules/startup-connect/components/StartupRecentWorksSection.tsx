"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type RecentWork = {
  id: string;
  title: string;
  description: string;
  github?: string;
  demo?: string;
  date?: string;
  images?: string[];
};

interface StartupRecentWorksSectionProps {
  companyId: string;
}

export function StartupRecentWorksSection({ companyId }: StartupRecentWorksSectionProps) {
  const [works, setWorks] = useState<RecentWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/startup-connect/dashboard/recent-works?companyId=${encodeURIComponent(companyId)}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success || !Array.isArray(json.data)) {
          if (!cancelled) {
            setWorks([]);
          }
          return;
        }
        if (!cancelled) {
          setWorks(json.data as RecentWork[]);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load recent works");
          setWorks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  return (
    <div id="recent-works" className="mt-10 space-y-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Recent milestones
          </p>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 sm:text-2xl">
            Recent works
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[1.75rem] border border-slate-100 bg-slate-50/80 p-8 text-center sm:p-10 text-sm font-bold text-slate-500">
          Loading recent works…
        </div>
      ) : error ? (
        <div className="rounded-[1.75rem] border border-amber-100 bg-amber-50/80 p-8 text-center sm:p-10 text-sm font-bold text-amber-900">
          {error}
        </div>
      ) : works.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {works.map((work) => {
            const image = Array.isArray(work.images) && work.images.length > 0 ? work.images[0] : undefined;
            return (
              <div
                key={work.id}
                className="group overflow-hidden rounded-2xl border border-sky-100/80 bg-linear-to-b from-white via-sky-50/40 to-emerald-50/20 shadow-[0_12px_32px_-12px_rgba(59,130,246,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgba(16,185,129,0.25)]"
              >
                {image ? (
                  <div className="relative h-32 overflow-hidden sm:h-36">
                    <img
                      src={image}
                      alt={work.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {work.date ? (
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-blue-700 shadow-sm">
                        {work.date}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 line-clamp-2 sm:text-base">
                    {work.title}
                  </h3>
                  <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-600 line-clamp-3">
                    {work.description}
                  </p>
                  {work.demo ? (
                    <div className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        className="flex-1 rounded-2xl bg-blue-700 text-[9px] font-black uppercase tracking-widest text-white shadow-md shadow-blue-100 hover:bg-blue-800 h-9"
                        onClick={() => window.open(work.demo!, "_blank")}
                      >
                        View project
                        <ExternalLink size={14} className="ml-2" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center sm:p-10">
          <p className="text-sm font-black text-slate-700">No public portfolio items yet</p>
          <p className="mx-auto mt-2 max-w-sm text-xs font-medium text-slate-500">
            When this startup adds recent works to their dashboard, they&apos;ll appear here for students to explore.
          </p>
        </div>
      )}
    </div>
  );
}
