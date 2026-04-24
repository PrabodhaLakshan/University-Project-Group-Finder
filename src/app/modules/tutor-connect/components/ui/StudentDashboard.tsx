"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  Clock,
  User,
  Filter,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import StudentNotificationsPanel from "../ui/StudentNotificationsPanel";

type TutorApiItem = {
  id: string;
  student_id: string;
  name: string;
  yearAndSem: string;
  bio: string | null;
  subjects: string[];
  language: string[];
  expertise: string[];
  ratings: number;
  reviews_count: number;
  nextAvailableSlot: {
    id: string;
    subject: string;
    slot_date: string;
    slot_time: string;
  } | null;
};

const gradientClasses = [
  "from-blue-500 to-indigo-600",
  "from-sky-400 to-blue-500",
  "from-indigo-400 to-purple-500",
  "from-slate-400 to-slate-600",
  "from-cyan-500 to-blue-600",
];

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tutors, setTutors] = useState<TutorApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTutors = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/tutor-connect/student-dashboard", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          const message = await res.text();
          setError(message || "Failed to load tutors");
          setLoading(false);
          return;
        }
        const data: TutorApiItem[] = await res.json();
        setTutors(data);
      } catch (err) {
        setError("Something went wrong while loading tutors.");
      } finally {
        setLoading(false);
      }
    };
    loadTutors();
  }, []);

  const filteredTutors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tutors;
    return tutors.filter((tutor) => {
      const name = tutor.name?.toLowerCase() || "";
      const subjects = tutor.subjects?.join(" ").toLowerCase() || "";
      return name.includes(q) || subjects.includes(q);
    });
  }, [searchQuery, tutors]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col pt-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Back Button */}
        <div className="transform transition-transform hover:-translate-x-1 duration-300">
          <Link
            href="/tutor-connect"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e40af] rounded-[28px] p-8 sm:p-10 text-white shadow-[0_20px_50px_rgba(37,99,235,0.2)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                Find Your Perfect Tutor
              </h1>
              <p className="text-blue-100/80 text-[15px] md:text-[16px] font-medium max-w-lg leading-relaxed">
                Connect with top-rated experts and schedule your next session in
                minutes.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:max-w-[380px] relative group/search">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-300 group-focus-within/search:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search subject or tutor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl outline-none focus:bg-white focus:text-slate-900 focus:ring-4 focus:ring-blue-400/20 transition-all placeholder:text-blue-100/40 text-sm"
              />
            </div>
          </div>

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <StudentNotificationsPanel />

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
            {["All Subjects", "Available", "Top Rated"].map((label, i) => (
              <button
                key={label}
                className={`px-5 py-2 rounded-full font-bold text-[13px] transition-all duration-300 ${
                  i === 0
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[13px] transition-colors group">
            <Filter className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[250px] bg-white rounded-[28px] animate-pulse border border-slate-100"
              />
            ))}
          </div>
        )}

        {/* Tutor Grid */}
        {!loading && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12">
            {filteredTutors.map((tutor, index) => {
              const hasSlot = !!tutor.nextAvailableSlot;
              return (
                <div
                  key={tutor.id}
                  className="relative bg-white rounded-[32px] border border-white p-6 flex flex-col sm:flex-row gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden"
                >
                  {/* Subtle Accent Background for Modern Look */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100px] -z-0 transition-colors group-hover:bg-blue-100/50" />

                  {/* Avatar Section */}
                  <div className="relative z-10 flex flex-col items-center sm:w-1/3 gap-3">
                    <div
                      className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${
                        gradientClasses[index % gradientClasses.length]
                      } p-[3px] transition-transform duration-500 group-hover:scale-105 shadow-sm`}
                    >
                      <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center">
                        <User className="w-10 h-10 text-slate-200" />
                      </div>
                    </div>
                    <div className="flex items-center bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1.5" />
                      <span className="font-bold text-slate-700 text-[12px]">
                        {Number(tutor.ratings ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tutor.name}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                          hasSlot
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-50 text-slate-400 border-slate-100"
                        }`}
                      >
                        {hasSlot ? "Available" : "No Slots"}
                      </span>
                    </div>
                    <p className="text-blue-600 font-bold text-[13px] mb-3">
                      {tutor.yearAndSem}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tutor.subjects.map((sub) => (
                        <span
                          key={sub}
                          className="bg-blue-50/50 text-blue-700 border border-blue-100/50 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>

                    <p className="text-slate-500 text-[13.5px] leading-relaxed line-clamp-2 mb-6">
                      {tutor.bio || "No bio added yet."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                        <Clock className="w-3 h-3 mr-2 text-blue-500" />
                        {hasSlot
                          ? `Next: ${formatDate(
                              tutor.nextAvailableSlot!.slot_date
                            )}`
                          : "No slots available"}
                      </div>

                      <Link
                        href={`/tutor-connect/booking/${tutor.id}`}
                        className="bg-slate-900 hover:bg-blue-600 text-white p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-lg shadow-slate-200 hover:shadow-blue-200"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}