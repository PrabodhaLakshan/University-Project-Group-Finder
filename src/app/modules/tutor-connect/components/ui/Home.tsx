// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";

// import { Calendar, Search, BookOpen, GraduationCap } from "lucide-react";

// export default function Home() {
//     const router = useRouter();

//     return (
//         <div className="min-h-screen bg-slate-50 flex flex-col">
//             {/* Top Banner */}
//             <div className="w-full bg-blue-600 bg-gradient-to-r from-blue-600 to-indigo-700 pt-20 pb-28 px-4 relative overflow-hidden">
//                 {/* Decorative elements */}
//                 <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
//                     <div className="absolute -top-[50%] -right-[10%] w-[60%] h-[200%] bg-white/5 rounded-[100%] transform -rotate-12 blur-[2px]" />
//                     <div className="absolute -bottom-[50%] -left-[10%] w-[60%] h-[200%] bg-white/5 rounded-[100%] transform rotate-12 blur-[2px]" />
//                 </div>

//                 <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
//                     <h1 className="text-[40px] md:text-[46px] font-bold text-white mb-4 tracking-tight">
//                         Tutor Connect
//                     </h1>
//                     <p className="text-blue-100 text-[18px] md:text-[20px] font-medium max-w-2xl mx-auto tracking-wide">
//                         Connect with a tutor and book your next session easily.
//                     </p>
//                 </div>
//             </div>

//             {/* Cards Section */}
//             <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-20">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

//                     {/* Tutor Card */}
//                     <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col border border-slate-100/50">
//                         {/* Card Header */}
//                         <div className="bg-blue-600 py-6 px-8 relative overflow-hidden text-center sm:text-left">
//                             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 z-0"></div>
//                             {/* Subtle bottom curve */}
//                             <div className="absolute -bottom-8 left-0 right-0 h-10 bg-white/10 rounded-[100%] blur-[4px]"></div>
//                             <h2 className="text-[22px] font-bold text-white relative z-10 tracking-wide">
//                                 Are You a Tutor?
//                             </h2>
//                         </div>

//                         {/* Card Body */}
//                         <div className="p-8 sm:p-10 flex-1 relative min-h-[340px]">
//                             <div className="relative z-10 sm:w-[55%] flex flex-col h-full">
//                                 <p className="text-slate-600 text-[16px] leading-relaxed mb-10 text-center sm:text-left">
//                                     Manage your tutoring slots and connect with students.
//                                 </p>

//                                 {/* Buttons */}
//                                 <div className="mt-auto flex flex-col items-center sm:items-start">
//                                     <button onClick={() => router.push("/tutor-connect/dashboard")} className="w-full max-w-[220px] flex items-center justify-center gap-3 py-3.5 px-6 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] transition-all duration-200 shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.2)]">
//                                         <Calendar className="w-5 h-5 shrink-0" />
//                                         <span>Are you a Tutor</span>
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Illustration Placeholder */}
//                             <div className="absolute right-6 bottom-10 w-44 h-44 bg-slate-50 rounded-full flex items-center justify-center opacity-10 sm:opacity-100 transition-opacity pointer-events-none">
//                                 <div className="absolute inset-0 bg-blue-50 rounded-full blur-md"></div>
//                                 <div className="relative flex flex-col items-center justify-center mt-4">
//                                     <GraduationCap className="w-20 h-20 text-blue-500 relative z-10" />
//                                     <BookOpen className="w-10 h-10 text-amber-500 absolute -bottom-2 -left-3 z-20 transform -rotate-12" />
//                                     {/* Small floating elements */}
//                                     <div className="absolute -top-4 -right-2 w-4 h-4 bg-blue-200 rounded-full"></div>
//                                     <div className="absolute -left-6 top-8 w-3 h-3 bg-blue-300 rounded-full"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Student Card */}
//                     <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col border border-slate-100/50">
//                         {/* Card Header */}
//                         <div className="bg-emerald-600 py-6 px-8 relative overflow-hidden text-center sm:text-left">
//                             <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 z-0"></div>
//                             {/* Subtle bottom curve */}
//                             <div className="absolute -bottom-8 left-0 right-0 h-10 bg-white/10 rounded-[100%] blur-[4px]"></div>
//                             <h2 className="text-[22px] font-bold text-white relative z-10 tracking-wide">
//                                 Are You Finding a Tutor?
//                             </h2>
//                         </div>

//                         {/* Card Body */}
//                         <div className="p-8 sm:p-10 flex-1 relative min-h-[340px]">
//                             <div className="relative z-10 sm:w-[55%] flex flex-col h-full">
//                                 <p className="text-slate-600 text-[16px] leading-relaxed mb-10 text-center sm:text-left">
//                                     Search for a tutor and book your next lesson.
//                                 </p>

//                                 {/* Buttons */}
//                                 <div className="mt-auto flex flex-col items-center sm:items-start">
//                                     <button onClick={() => router.push("/tutor-connect/student-dashboard")} className="w-full max-w-[220px] flex items-center justify-center gap-3 py-3.5 px-6 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[15px] transition-all duration-200 shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.2)]">
//                                         <Search className="w-5 h-5 shrink-0" />
//                                         <span>Find Tutor?</span>
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Illustration Placeholder */}
//                             <div className="absolute right-6 bottom-10 w-44 h-44 bg-slate-50 rounded-full flex items-center justify-center opacity-10 sm:opacity-100 transition-opacity pointer-events-none">
//                                 <div className="absolute inset-0 bg-emerald-50 rounded-full blur-md"></div>
//                                 <div className="relative mt-2">
//                                     <Search className="w-20 h-20 text-emerald-500 relative z-10" />
//                                     <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center z-20 shadow-sm -rotate-12">
//                                         <span className="text-amber-500 font-extrabold text-xl">?</span>
//                                     </div>
//                                     <div className="absolute top-10 -left-6 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center z-20 shadow-sm rotate-12">
//                                         <span className="text-amber-500 font-extrabold text-lg">?</span>
//                                     </div>
//                                     <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-emerald-200 rounded-full"></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }
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