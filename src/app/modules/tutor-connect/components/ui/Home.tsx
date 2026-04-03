"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, Search, BookOpen, GraduationCap, ArrowRight, 
  Book, Pencil, Laptop, Atom, Globe, Lightbulb 
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleTutorClick = () => {
    router.push("/tutor-connect/register-check");
  };

  const handleStudentClick = () => {
    router.push("/tutor-connect/student-dashboard");
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-50/50 relative overflow-hidden font-sans flex flex-col items-center justify-center">
      
      {/* Background Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-wavy {
          0% { transform: translate(0, 110vh) rotate(0deg) scale(0.8); opacity: 0; }
          15% { opacity: 0.2; }
          30% { transform: translate(30px, 70vh) rotate(90deg) scale(1.1); }
          50% { transform: translate(-20px, 50vh) rotate(180deg) scale(1); }
          70% { transform: translate(25px, 30vh) rotate(270deg) scale(1.15); }
          85% { opacity: 0.2; }
          100% { transform: translate(-10px, -10vh) rotate(360deg) scale(0.9); opacity: 0; }
        }
        .icon-float {
          position: absolute;
          color: #94a3b8;
          animation: float-wavy linear infinite;
          z-index: 0;
        }
      `}} />

      {/* Animated Education Icons Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-[100px]"></div>

        <Lightbulb className="icon-float" style={{ left: '8%', animationDuration: '22s', animationDelay: '0s', width: '40px', height: '40px' }} />
        <Book className="icon-float" style={{ left: '22%', animationDuration: '28s', animationDelay: '4s', width: '30px', height: '30px' }} />
        <GraduationCap className="icon-float" style={{ left: '38%', animationDuration: '25s', animationDelay: '2s', width: '45px', height: '45px' }} />
        <Atom className="icon-float" style={{ left: '55%', animationDuration: '30s', animationDelay: '7s', width: '35px', height: '35px' }} />
        <Laptop className="icon-float" style={{ left: '75%', animationDuration: '26s', animationDelay: '1s', width: '40px', height: '40px' }} />
        <Globe className="icon-float" style={{ left: '88%', animationDuration: '32s', animationDelay: '5s', width: '35px', height: '35px' }} />
        <Pencil className="icon-float" style={{ left: '15%', animationDuration: '24s', animationDelay: '9s', width: '25px', height: '25px' }} />
        <BookOpen className="icon-float" style={{ left: '68%', animationDuration: '27s', animationDelay: '12s', width: '35px', height: '35px' }} />
      </div>

      <div className="relative z-10 w-full max-w-[850px] mx-auto px-4 sm:px-6 flex flex-col justify-center h-full max-h-[750px]">
        
        {/* Header Section - Modernized Styling */}
        <div className="text-center flex-none mb-6 md:mb-8">
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm text-blue-600 text-[10px] font-bold tracking-[0.2em] uppercase">
            <GraduationCap className="w-3 h-3" />
            UniNexus
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3">
            <span className="text-indigo-950">Tutor </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500">
              Connect
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 font-medium max-w-lg mx-auto leading-relaxed px-2">
            Find your perfect learning match. Connect, learn, and grow together.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-none">
          
          {/* Tutor Card */}
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[24px] p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] border border-white transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
            <GraduationCap className="absolute -bottom-6 -right-6 w-40 h-40 text-blue-100/60 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10 mb-4 md:mb-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-[14px] flex items-center justify-center mb-4 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Calendar className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1.5">Are You a Tutor?</h2>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-[95%]">
                Manage your slots, reach more students, and share your expertise easily.
              </p>
            </div>

            <div className="mt-auto relative z-10">
              <button
                onClick={handleTutorClick}
                className="w-full flex items-center justify-between group/btn py-3 px-5 rounded-xl bg-slate-50 hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-white font-semibold text-sm transition-all duration-300 shadow-sm"
              >
                <span>Continue as Tutor</span>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Student Card */}
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-[24px] p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] border border-white transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
            <Search className="absolute -bottom-6 -right-6 w-40 h-40 text-emerald-100/60 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10 mb-4 md:mb-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-[14px] flex items-center justify-center mb-4 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1.5">Finding a Tutor?</h2>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-[95%]">
                Search verified profiles, compare tutors, and book your next session instantly.
              </p>
            </div>

            <div className="mt-auto relative z-10">
              <button
                onClick={handleStudentClick}
                className="w-full flex items-center justify-between group/btn py-3 px-5 rounded-xl bg-slate-50 hover:bg-emerald-600 border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-white font-semibold text-sm transition-all duration-300 shadow-sm"
              >
                <span>Find a Tutor</span>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}