"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { COMPANY_DETAILS } from "@/app/modules/startup-connect/constants/company-details";
import { getToken } from "@/lib/auth";
import { COMPANY_UUID_RE } from "@/lib/companyUuid";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070";

type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  github: string | null;
  demo: string;
  date: string;
  images: string[];
};

const MyProjectsPage = () => {
  const searchParams = useSearchParams();
  const startupId = searchParams.get("startupId");
  const companyFromSlug = startupId ? COMPANY_DETAILS[startupId] : undefined;

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getToken();
        
        // Always derive recent works from the dashboard response.
        // This guarantees we use the connected founder's company_id via JWT
        // (and avoids 404 "No startup company found" UI errors).
        const res = await fetch("/api/startup-connect/dashboard", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const json = await res.json().catch(() => ({}));
        const payload = (json as any).data ?? json;

        const list = Array.isArray(payload?.recentWorks) ? payload.recentWorks : [];
        setProjects(list as PortfolioProject[]);
      } catch (e) {
        console.error(e);
        const msg = e instanceof Error ? e.message : "Failed to load projects";
        // For common "not registered yet" / auth mismatch cases, show empty state.
        if (
          msg.includes("No startup company found") ||
          msg.toLowerCase().includes("unauthorized") ||
          msg.toLowerCase().includes("forbidden")
        ) {
          setError(null);
        } else {
          setError(msg);
        }
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const headerTitle = companyFromSlug
    ? `${companyFromSlug.name} Recent Works`
    : "Our Recent Projects";

  return (
    <div className="min-h-screen bg-slate-50/30 pb-12 pt-6 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Link
          href="/startup-connect/browse-gigs"
          className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-700 mb-4 sm:mb-6"
        >
          <ArrowLeft size={14} /> Back to Browse Gigs
        </Link>

        <div className="mb-8 sm:mb-16">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight break-words">
              {companyFromSlug ? (
                headerTitle
              ) : (
                <span className="text-orange-600">{headerTitle}</span>
              )}
            </h1>
            <p className="text-slate-500 font-bold mt-2 text-xs sm:text-sm max-w-2xl">
              Projects you add under Startup Portfolio on your dashboard appear here.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl sm:rounded-[28px] border border-slate-100 bg-white p-8 sm:p-12 text-center text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest">
            Loading projects…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {projects.map((project) => {
              const imageSrc =
                project.images?.length > 0 ? project.images[0] : PLACEHOLDER_IMG;
              const hasDemo = Boolean(project.demo?.trim());
              const hasGithub = Boolean(project.github?.trim());

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl sm:rounded-[28px] p-3 sm:p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-sky-100/40 transition-all group w-full min-w-0 max-w-full"
                >
                  <div className="aspect-[16/10] sm:aspect-[16/9] max-h-[200px] sm:max-h-none rounded-xl sm:rounded-[24px] overflow-hidden mb-3 sm:mb-4 bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3 min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start sm:gap-3">
                      <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 line-clamp-2 min-w-0 flex-1 break-words">
                        {project.title}
                      </h2>
                      <span className="text-[9px] sm:text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 shrink-0 self-start">
                        {project.date}
                      </span>
                    </div>
                    <p className="text-slate-500 font-bold text-[11px] sm:text-sm line-clamp-3 break-words">
                      &ldquo;{project.description}&rdquo;
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl border-slate-200 font-bold flex-1 min-h-11 text-xs sm:text-sm"
                        disabled={!hasGithub}
                        onClick={() =>
                          hasGithub && window.open(project.github!, "_blank")
                        }
                      >
                        <Github className="w-4 h-4 mr-2 shrink-0" /> Code
                      </Button>
                      <Button
                        type="button"
                        className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex-1 min-h-11 text-xs sm:text-sm"
                        disabled={!hasDemo}
                        onClick={() =>
                          hasDemo && window.open(project.demo, "_blank")
                        }
                      >
                        Live Demo <ExternalLink className="w-4 h-4 ml-2 shrink-0" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <div className="rounded-2xl sm:rounded-[28px] border border-dashed border-slate-200 bg-white p-8 sm:p-12 text-center">
            <p className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-widest">
              No portfolio projects yet
            </p>
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 mt-2 max-w-md mx-auto">
              Add projects from your startup dashboard → Startup Portfolio → New Project.
            </p>
            <Link
              href="/startup-connect/dashboard"
              className="inline-block mt-6 text-xs font-black uppercase tracking-widest text-sky-600 hover:text-sky-800"
            >
              Go to dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjectsPage;
