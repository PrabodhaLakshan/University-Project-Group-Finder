"use client";
import React, { useState } from "react";
import { Search, Star, Clock, User, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

const MOCK_TUTORS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    yearAndSem: "Year 4 Sem 1",

    rating: 4.9,
    reviews: 128,
    hourlyRate: 45,
    tags: ["React", "Next.js", "TypeScript"],
    availability: "Next available: Today, 3:00 PM",
    bio: "Passionate about creating modern, accessible web apps and helping students master frontend development.",
    imageColor: "from-blue-400 to-indigo-500",
  },
  {
    id: 2,
    name: "David Chen",
    yearAndSem: "Year 3 Sem 2",

    rating: 4.8,
    reviews: 94,
    hourlyRate: 55,
    tags: ["Node.js", "Python", "System Design"],
    availability: "Next available: Tomorrow, 10:00 AM",
    bio: "Focuses on scalable backend architectures and interview preparation for top tech companies.",
    imageColor: "from-emerald-400 to-teal-500",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    yearAndSem: "Year 2 Sem 2",

    rating: 5.0,
    reviews: 215,
    hourlyRate: 40,
    tags: ["CSS", "Tailwind", "Figma", "HTML"],
    availability: "Next available: Today, 5:30 PM",
    bio: "I help bridge the gap between design and development. Let's make your apps look beautiful!",
    imageColor: "from-orange-400 to-rose-500",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    yearAndSem: "Year 4 Sem 2",

    rating: 4.7,
    reviews: 62,
    hourlyRate: 50,
    tags: ["Machine Learning", "Python", "SQL"],
    availability: "Next available: Wed, 1:00 PM",
    bio: "Making complex data problems simple to understand. Great for beginners starting their ML journey.",
    imageColor: "from-violet-400 to-purple-500",
  }
];

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
      <div className="max-w-7xl mx-auto w-full space-y-8">

        {/* Header section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[24px] p-8 sm:p-10 text-white shadow-[0_8px_30px_rgb(16,185,129,0.15)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Find Your Perfect Tutor
              </h1>
              <p className="text-emerald-100/90 text-[17px] font-medium max-w-xl">
                Browse through our verified experts and book a session today to accelerate your learning.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-600/60" />
              </div>
              <input
                type="text"
                placeholder="Search by subject, skill, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-sm transition-all border-0 font-medium placeholder:text-slate-400"
              />
              <button className="absolute inset-y-1.5 right-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 rounded-lg text-sm font-semibold transition-colors">
                Search
              </button>
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar scroll-smooth">
            <button className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-sm whitespace-nowrap">
              All Subjects
            </button>
            <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm whitespace-nowrap transition-colors">
              Development
            </button>
            <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm whitespace-nowrap transition-colors">
              Design
            </button>
            <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm whitespace-nowrap transition-colors">
              Data Science
            </button>
          </div>
          <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-medium text-sm transition-colors py-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {MOCK_TUTORS.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group border border-slate-100/80 p-6 flex flex-col sm:flex-row gap-6">

              {/* Avatar Column */}
              <div className="flex flex-col items-center sm:w-1/3 gap-3">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${tutor.imageColor} p-1 shadow-md`}>
                  <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center border-2 border-white">
                    <User className="w-10 h-10 text-slate-300" />
                  </div>
                </div>

              </div>

              {/* Content Column */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-slate-800">{tutor.name}</h3>
                  <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-md">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1.5" />
                    <span className="font-bold text-slate-700 text-[13px]">{tutor.rating}</span>
                    <span className="text-slate-400 text-xs ml-1 font-medium">({tutor.reviews})</span>
                  </div>
                </div>

                <p className="text-emerald-600 font-semibold text-[14.5px] mb-3">{tutor.yearAndSem} </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.tags.map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-slate-600 text-[14.5px] leading-relaxed line-clamp-2 md:line-clamp-3 mb-5 flex-1 max-w-lg">
                  {tutor.bio}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center text-[13.5px] font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                    <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                    {tutor.availability}
                  </div>
                  <Link href={`/tutor-connect/booking/${tutor.id}`} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn">
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
