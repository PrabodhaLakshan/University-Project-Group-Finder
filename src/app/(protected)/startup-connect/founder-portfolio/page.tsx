"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_DETAILS } from "@/app/modules/startup-connect/constants/company-details";

type PortfolioProject = {
  id: number;
  title: string;
  description: string;
  github?: string;
  demo?: string;
  date: string;
  images: string[];
};

const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 1,
    title: "Campus Event Hub",
    description: "Platform for student club events, registrations, and live updates.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Mar 2026",
    images: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070&auto=format&fit=crop",
    ],
  },
  {
    id: 2,
    title: "Founder Portfolio Site",
    description: "Personal brand website to showcase traction, metrics, and milestones.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Jan 2026",
    images: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop",
    ],
  },
];

export default function FounderPortfolioPage() {
  const searchParams = useSearchParams();
  const startupId = searchParams.get("startupId");
  const company = startupId ? COMPANY_DETAILS[startupId] : undefined;

  const [projects] = useState<PortfolioProject[]>(INITIAL_PROJECTS);

  const title = company
    ? `${company.name} – Founder Portfolio`
    : "Founder Portfolio";

  return (
    <main className="min-h-screen bg-white pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href={startupId ? `/startup-connect/${startupId}` : "/startup-connect/browse-gigs"}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={14} /> Back to Company
        </Link>

        <section className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
            Founder Portfolio
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-slate-500 font-bold mt-2 max-w-2xl text-sm md:text-base">
            A snapshot of recent work, product experiments, and launches led by the founder to move the startup forward.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all group"
            >
              <div className="aspect-video rounded-[26px] overflow-hidden mb-5 md:mb-6">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="space-y-3">
                <header className="flex items-center justify-between gap-3">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 italic leading-tight">
                    {project.title}
                  </h2>
                  <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 whitespace-nowrap">
                    {project.date}
                  </span>
                </header>

                <p className="text-slate-500 font-bold text-xs md:text-sm italic leading-relaxed">
                  "{project.description}"
                </p>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-slate-200 font-bold flex-1 text-xs md:text-sm"
                    onClick={() => project.github && window.open(project.github, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" /> Code
                  </Button>
                  <Button
                    type="button"
                    className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex-1 text-xs md:text-sm"
                    onClick={() => project.demo && window.open(project.demo, "_blank")}
                  >
                    Live Demo <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
