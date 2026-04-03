// "use client";
// import React, { useState } from "react";
// import { Search, Star, Clock, User, Filter, ArrowRight, ArrowLeft } from "lucide-react";
// import Link from "next/link";

// const MOCK_TUTORS = [
//   {
//     id: 1,
//     name: "Nadeesha Perera",
//     yearAndSem: "Year 4 Sem 1",

//     rating: 4.9,
//     reviews: 128,
//     hourlyRate: 45,
//     tags: ["React", "Next.js", "TypeScript"],
//     availability: "Next available: Today, 3:00 PM",
//     bio: "Passionate about creating modern, accessible web apps and helping students master frontend development.",
//     imageColor: "from-blue-400 to-indigo-500",
//   },
//   {
//     id: 2,
//     name: "Kasun Madushanka",
//     yearAndSem: "Year 3 Sem 2",

//     rating: 4.8,
//     reviews: 94,
//     hourlyRate: 55,
//     tags: ["Node.js", "Python", "System Design"],
//     availability: "Next available: Tomorrow, 10:00 AM",
//     bio: "Focuses on scalable backend architectures and interview preparation for top tech companies.",
//     imageColor: "from-emerald-400 to-teal-500",
//   },
//   {
//     id: 3,
//     name: "Tharushi Senanayake",
//     yearAndSem: "Year 2 Sem 2",

//     rating: 5.0,
//     reviews: 215,
//     hourlyRate: 40,
//     tags: ["CSS", "Tailwind", "Figma", "HTML"],
//     availability: "Next available: Today, 5:30 PM",
//     bio: "I help bridge the gap between design and development. Let's make your apps look beautiful!",
//     imageColor: "from-orange-400 to-rose-500",
//   },
//   {
//     id: 4,
//     name: "Dulani Wickramasinghe",
//     yearAndSem: "Year 4 Sem 2",

//     rating: 4.7,
//     reviews: 62,
//     hourlyRate: 50,
//     tags: ["Machine Learning", "Python", "SQL"],
//     availability: "Next available: Wed, 1:00 PM",
//     bio: "Making complex data problems simple to understand. Great for beginners starting their ML journey.",
//     imageColor: "from-violet-400 to-purple-500",
//   }
// ];

// export default function StudentDashboard() {
//   const [searchQuery, setSearchQuery] = useState("");

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
//       <div className="max-w-7xl mx-auto w-full space-y-8">
//         <div>
//           <Link
//             href="/tutor-connect"
//             className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-200 hover:text-emerald-700"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             <span>Back to Home</span>
//           </Link>
//         </div>

//         {/* Header section */}
//         <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[24px] p-8 sm:p-10 text-white shadow-[0_8px_30px_rgb(16,185,129,0.15)] relative overflow-hidden">
//           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-4xl font-bold tracking-tight mb-3">
//                 Find Your Perfect Tutor
//               </h1>
//               <p className="text-emerald-100/90 text-[17px] font-medium max-w-xl">
//                 Browse through our verified experts and book a session today to accelerate your learning.
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="w-full md:max-w-md relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-emerald-600/60" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by subject, skill, or name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-sm transition-all border-0 font-medium placeholder:text-slate-400"
//               />
//               <button className="absolute inset-y-1.5 right-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 rounded-lg text-sm font-semibold transition-colors">
//                 Search
//               </button>
//             </div>
//           </div>
//           {/* Decorative gradients */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
//         </div>

//         {/* Filter Bar */}
//         <div className="flex flex-wrap items-center justify-between gap-4 py-2">
//           <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar scroll-smooth">
//             <button className="px-5 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-sm whitespace-nowrap">
//               All Subjects
//             </button>
//             <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm whitespace-nowrap transition-colors">
//               Development
//             </button>
//             <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm whitespace-nowrap transition-colors">
//               Design
//             </button>
//             <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm whitespace-nowrap transition-colors">
//               Data Science
//             </button>
//           </div>
//           <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-medium text-sm transition-colors py-2">
//             <Filter className="w-4 h-4" />
//             <span>More Filters</span>
//           </button>
//         </div>

//         {/* Tutors Grid */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//           {MOCK_TUTORS.map((tutor) => (
//             <div key={tutor.id} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group border border-slate-100/80 p-6 flex flex-col sm:flex-row gap-6">

//               {/* Avatar Column */}
//               <div className="flex flex-col items-center sm:w-1/3 gap-3">
//                 <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${tutor.imageColor} p-1 shadow-md`}>
//                   <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center border-2 border-white">
//                     <User className="w-10 h-10 text-slate-300" />
//                   </div>
//                 </div>

//               </div>

//               {/* Content Column */}
//               <div className="flex-1 flex flex-col">
//                 <div className="flex justify-between items-start mb-1">
//                   <h3 className="text-xl font-bold text-slate-800">{tutor.name}</h3>
//                   <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-md">
//                     <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1.5" />
//                     <span className="font-bold text-slate-700 text-[13px]">{tutor.rating}</span>
//                     <span className="text-slate-400 text-xs ml-1 font-medium">({tutor.reviews})</span>
//                   </div>
//                 </div>

//                 <p className="text-emerald-600 font-semibold text-[14.5px] mb-3">{tutor.yearAndSem} </p>

//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {tutor.tags.map(tag => (
//                     <span key={tag} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
//                       {tag}
//                     </span>
//                   ))}
//                 </div>

//                 <p className="text-slate-600 text-[14.5px] leading-relaxed line-clamp-2 md:line-clamp-3 mb-5 flex-1 max-w-lg">
//                   {tutor.bio}
//                 </p>

//                 <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="flex items-center text-[13.5px] font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
//                     <Clock className="w-4 h-4 mr-2 text-emerald-500" />
//                     {tutor.availability}
//                   </div>
//                   <Link href={`/tutor-connect/booking/${tutor.id}`} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn">
//                     <span>View Profile</span>
//                     <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
//                   </Link>
//                 </div>
//               </div>

//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }
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
    new Date(dateString).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });

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
                Connect with top-rated experts and schedule your next session in minutes.
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
              <div key={i} className="h-[250px] bg-white rounded-[28px] animate-pulse border border-slate-100" />
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
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradientClasses[index % gradientClasses.length]} p-[3px] transition-transform duration-500 group-hover:scale-105 shadow-sm`}>
                      <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center">
                        <User className="w-10 h-10 text-slate-200" />
                      </div>
                    </div>
                    <div className="flex items-center bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1.5" />
                      <span className="font-bold text-slate-700 text-[12px]">{Number(tutor.ratings ?? 0).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tutor.name}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                        hasSlot ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}>
                        {hasSlot ? "Available" : "No Slots"}
                      </span>
                    </div>
                    <p className="text-blue-600 font-bold text-[13px] mb-3">{tutor.yearAndSem}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tutor.subjects.map(sub => (
                        <span key={sub} className="bg-blue-50/50 text-blue-700 border border-blue-100/50 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight">
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
                        {hasSlot ? `Next: ${formatDate(tutor.nextAvailableSlot!.slot_date)}` : "No slots available"}
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