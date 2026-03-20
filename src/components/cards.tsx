"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Stat = { label: string; value: string };

type CardConfig = {
  title: string;
  desc: string;
  pill: string;
  stats: Stat[];
  btn: string;
  href: string;
};

export default function CampusPlatformCards() {
  const router = useRouter();

  const cards: CardConfig[] = [
    {
      title: "Project Group Finder",
      desc: "Find teammates by skills, year & specialization.",
      pill: "Collaboration",
      stats: [
        { label: "Matches", value: "128" },
        { label: "Requests", value: "34" },
        { label: "Groups", value: "12" },
      ],
      btn: "Open Module",
      href: "/project-group-finder",
    },
    {
      title: "Campus eMart",
      desc: "Buy & sell books, devices & campus essentials.",
      pill: "Marketplace",
      stats: [
        { label: "Listings", value: "540" },
        { label: "Orders", value: "86" },
        { label: "Sellers", value: "120" },
      ],
      btn: "Open Module",
      href: "/uni-mart",
    },
    {
      title: "Tutor Finder",
      desc: "Find tutors by module, year & availability.",
      pill: "Education",
      stats: [
        { label: "Tutors", value: "78" },
        { label: "Modules", value: "32" },
        { label: "Bookings", value: "19" },
      ],
      btn: "Open Module",
      href: "/tutor-connect",
    },
    {
      title: "StartUp & Connect",
      desc: "Freelancer finder for startups & student gigs.",
      pill: "Freelance",
      stats: [
        { label: "Freelancers", value: "210" },
        { label: "Gigs", value: "45" },
        { label: "Hires", value: "17" },
      ],
      btn: "Open Module",
      href: "/startup-connect",
    },
  ];

  return (
    <div className="min-h-screen bg-black p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-semibold text-white tracking-wide text-center">
          Campus Digital Platform
        </h1>
        <p className="text-white/60 text-center mt-2">
          Smart student ecosystem • Dark UI • Neon Spotlight Hover
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {cards.map((c) => (
            <SpotlightCard
              key={c.title}
              title={c.title}
              desc={c.desc}
              pill={c.pill}
              stats={c.stats}
              btn={c.btn}
              onOpen={() => router.push(c.href)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpotlightCard({
  title,
  desc,
  pill,
  stats,
  btn,
  onOpen,
}: {
  title: string;
  desc: string;
  pill: string;
  stats: { label: string; value: string }[];
  btn: string;
  onOpen: () => void;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      className="
        relative overflow-hidden cursor-pointer
        rounded-2xl border border-white/10
        bg-gradient-to-b from-[#0a1020] to-black
        p-6
        transition-all duration-300
        hover:-translate-y-2
        hover:border-blue-500/40
        hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]
        focus:outline-none focus:ring-2 focus:ring-blue-500/30
        group
      "
    >
      {/* Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.25), transparent 40%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              {title}
            </h2>
            <p className="text-sm text-white/60 mt-1">{desc}</p>
          </div>

          <span
            className="
              text-xs font-medium
              rounded-full px-3 py-1
              bg-blue-500/10 text-blue-300
              border border-blue-500/20
            "
          >
            {pill}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="
                rounded-xl border border-white/10
                bg-white/5 p-3
                transition
                group-hover:bg-blue-500/10 group-hover:border-blue-500/25
              "
            >
              <p className="text-xs text-white/60">{s.label}</p>
              <p className="text-lg font-semibold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // card click avoid double events
            onOpen();
          }}
          className="
            mt-6 w-full rounded-xl
            bg-blue-600/90 text-white font-medium
            py-3
            transition-all duration-300
            hover:bg-blue-500
            hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]
            active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-blue-500/30
          "
        >
          {btn}
        </button>
      </div>
    </div>
  );
}