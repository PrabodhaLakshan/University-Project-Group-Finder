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
import { Calendar, Search, BookOpen, GraduationCap } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleTutorClick = () => {
    router.push("/tutor-connect/register-check");
  };

  const handleStudentClick = () => {
    router.push("/tutor-connect/student-dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full bg-blue-600 bg-gradient-to-r from-blue-600 to-indigo-700 pt-20 pb-28 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[50%] -right-[10%] w-[60%] h-[200%] bg-white/5 rounded-[100%] transform -rotate-12 blur-[2px]" />
          <div className="absolute -bottom-[50%] -left-[10%] w-[60%] h-[200%] bg-white/5 rounded-[100%] transform rotate-12 blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-[40px] md:text-[46px] font-bold text-white mb-4 tracking-tight">
            Tutor Connect
          </h1>
          <p className="text-blue-100 text-[18px] md:text-[20px] font-medium max-w-2xl mx-auto tracking-wide">
            Connect with a tutor and book your next session easily.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col border border-slate-100/50">
            <div className="bg-blue-600 py-6 px-8 relative overflow-hidden text-center sm:text-left">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 z-0"></div>
              <div className="absolute -bottom-8 left-0 right-0 h-10 bg-white/10 rounded-[100%] blur-[4px]"></div>
              <h2 className="text-[22px] font-bold text-white relative z-10 tracking-wide">
                Are You a Tutor?
              </h2>
            </div>

            <div className="p-8 sm:p-10 flex-1 relative min-h-[340px]">
              <div className="relative z-10 sm:w-[55%] flex flex-col h-full">
                <p className="text-slate-600 text-[16px] leading-relaxed mb-10 text-center sm:text-left">
                  Manage your tutoring slots and connect with students.
                </p>

                <div className="mt-auto flex flex-col items-center sm:items-start">
                  <button
                    onClick={handleTutorClick}
                    className="w-full max-w-[220px] flex items-center justify-center gap-3 py-3.5 px-6 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] transition-all duration-200 shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.2)]"
                  >
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span>Are you a Tutor?</span>
                  </button>
                </div>
              </div>

              <div className="absolute right-6 bottom-10 w-44 h-44 bg-slate-50 rounded-full flex items-center justify-center opacity-10 sm:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-blue-50 rounded-full blur-md"></div>
                <div className="relative flex flex-col items-center justify-center mt-4">
                  <GraduationCap className="w-20 h-20 text-blue-500 relative z-10" />
                  <BookOpen className="w-10 h-10 text-amber-500 absolute -bottom-2 -left-3 z-20 transform -rotate-12" />
                  <div className="absolute -top-4 -right-2 w-4 h-4 bg-blue-200 rounded-full"></div>
                  <div className="absolute -left-6 top-8 w-3 h-3 bg-blue-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col border border-slate-100/50">
            <div className="bg-emerald-600 py-6 px-8 relative overflow-hidden text-center sm:text-left">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 z-0"></div>
              <div className="absolute -bottom-8 left-0 right-0 h-10 bg-white/10 rounded-[100%] blur-[4px]"></div>
              <h2 className="text-[22px] font-bold text-white relative z-10 tracking-wide">
                Are You Finding a Tutor?
              </h2>
            </div>

            <div className="p-8 sm:p-10 flex-1 relative min-h-[340px]">
              <div className="relative z-10 sm:w-[55%] flex flex-col h-full">
                <p className="text-slate-600 text-[16px] leading-relaxed mb-10 text-center sm:text-left">
                  Search for a tutor and book your next lesson.
                </p>

                <div className="mt-auto flex flex-col items-center sm:items-start">
                  <button
                    onClick={handleStudentClick}
                    className="w-full max-w-[220px] flex items-center justify-center gap-3 py-3.5 px-6 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[15px] transition-all duration-200 shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.2)]"
                  >
                    <Search className="w-5 h-5 shrink-0" />
                    <span>Find Tutor?</span>
                  </button>
                </div>
              </div>

              <div className="absolute right-6 bottom-10 w-44 h-44 bg-slate-50 rounded-full flex items-center justify-center opacity-10 sm:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-emerald-50 rounded-full blur-md"></div>
                <div className="relative mt-2">
                  <Search className="w-20 h-20 text-emerald-500 relative z-10" />
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center z-20 shadow-sm -rotate-12">
                    <span className="text-amber-500 font-extrabold text-xl">?</span>
                  </div>
                  <div className="absolute top-10 -left-6 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center z-20 shadow-sm rotate-12">
                    <span className="text-amber-500 font-extrabold text-lg">?</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-emerald-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}