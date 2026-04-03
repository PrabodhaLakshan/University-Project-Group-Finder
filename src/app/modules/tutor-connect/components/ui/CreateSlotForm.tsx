// "use client";

// import { useState } from "react";
// import { CalendarDays, Clock, BookOpen, Plus, Sparkles } from "lucide-react";

// export default function CreateSlotForm() {
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [subject, setSubject] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<{ date?: string; time?: string; subject?: string }>({});

//   // Today's date in YYYY-MM-DD format (local time)
//   const today = new Date();
//   const todayStr = today.toLocaleDateString("en-CA"); // "YYYY-MM-DD"

//   // Current time as "HH:MM"
//   const nowTimeStr = today.toTimeString().slice(0, 5);

//   const validate = (): boolean => {
//     const newErrors: { date?: string; time?: string; subject?: string } = {};

//     if (!date) {
//       newErrors.date = "Please select a date.";
//     } else if (date < todayStr) {
//       newErrors.date = "Date cannot be in the past.";
//     }

//     if (!time) {
//       newErrors.time = "Please select a time.";
//     } else if (date === todayStr && time <= nowTimeStr) {
//       newErrors.time = "Time must be in the future for today's date.";
//     }

//     if (!subject.trim()) {
//       newErrors.subject = "Please enter a subject.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setIsSubmitting(true);
//     // Simulate API call
//     setTimeout(() => {
//       console.log({ date, time, subject });
//       alert("Slot Created Successfully!");
//       setIsSubmitting(false);
//       setDate("");
//       setTime("");
//       setSubject("");
//       setErrors({});
//     }, 800);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col items-center justify-start pt-12">
//       <div className="w-full max-w-2xl">
//         {/* Header Section */}
//         <div className="mb-8 text-center space-y-2">
//           <div className="inline-flex items-center justify-center p-3.5 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-sm ring-4 ring-blue-50/50">
//             <CalendarDays className="w-8 h-8" />
//           </div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//             Create New Slot
//           </h1>
//           <p className="text-slate-500 text-[15px]">
//             Add a new tutoring session to your schedule
//           </p>
//         </div>

//         {/* Form Container */}
//         <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100/80 p-8 sm:p-10 transition-all duration-300 relative overflow-hidden">
          
//           <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
//               {/* Date Input */}
//               <div className="space-y-2.5">
//                 <label className="flex items-center text-sm font-semibold text-slate-700">
//                   <CalendarDays className="w-4 h-4 mr-2 text-slate-400" />
//                   Date
//                 </label>
//                 <div className="relative group">
//                   <input
//                     type="date"
//                     min={todayStr}
//                     className={`w-full bg-slate-50/50 border rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm ${
//                       errors.date
//                         ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
//                         : "border-slate-200/80 focus:border-blue-500/50"
//                     }`}
//                     value={date}
//                     onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: undefined })); }}
//                   />
//                 </div>
//                 {errors.date && (
//                   <p className="text-[13px] text-red-500 font-medium mt-1">{errors.date}</p>
//                 )}
//               </div>

//               {/* Time Input */}
//               <div className="space-y-2.5">
//                 <label className="flex items-center text-sm font-semibold text-slate-700">
//                   <Clock className="w-4 h-4 mr-2 text-slate-400" />
//                   Time
//                 </label>
//                 <div className="relative group">
//                   <input
//                     type="time"
//                     min={date === todayStr ? nowTimeStr : undefined}
//                     className={`w-full bg-slate-50/50 border rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm ${
//                       errors.time
//                         ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
//                         : "border-slate-200/80 focus:border-blue-500/50"
//                     }`}
//                     value={time}
//                     onChange={(e) => { setTime(e.target.value); setErrors((prev) => ({ ...prev, time: undefined })); }}
//                   />
//                 </div>
//                 {errors.time && (
//                   <p className="text-[13px] text-red-500 font-medium mt-1">{errors.time}</p>
//                 )}
//               </div>
//             </div>

//             {/* Subject Input */}
//             <div className="space-y-2.5">
//               <label className="flex items-center text-sm font-semibold text-slate-700">
//                 <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
//                 Subject
//               </label>
//               <div className="relative group">
//                 <input
//                   type="text"
//                   placeholder="e.g., Database Systems, Web Development..."
//                   className={`w-full bg-slate-50/50 border rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] placeholder:text-slate-400/80 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm ${
//                     errors.subject
//                       ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
//                       : "border-slate-200/80 focus:border-blue-500/50"
//                   }`}
//                   value={subject}
//                   onChange={(e) => { setSubject(e.target.value); setErrors((prev) => ({ ...prev, subject: undefined })); }}
//                 />
//               </div>
//               {errors.subject && (
//                 <p className="text-[13px] text-red-500 font-medium mt-1">{errors.subject}</p>
//               )}
//             </div>

//             <div className="pt-3">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-[14px] transition-all duration-200 font-semibold text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:opacity-70 disabled:hover:shadow-none"
//               >
//                 {isSubmitting ? (
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     <Plus className="w-5 h-5" />
//                     <span>Create Slot</span>
//                   </>
//                 )}
//               </button>
//             </div>

//           </form>

//           {/* Additional Info */}
//           <div className="mt-8 p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-[16px] border border-blue-100/50 relative z-10">
//             <div className="flex items-start space-x-3.5">
//               <div className="p-2.5 bg-blue-100/80 rounded-xl shrink-0 shadow-sm">
//                 <Sparkles className="w-4 h-4 text-blue-600" />
//               </div>
//               <div className="pt-0.5">
//                 <h3 className="text-sm font-bold text-blue-900 mb-1">Expert Tip</h3>
//                 <p className="text-[14px] leading-relaxed text-blue-800/80">
//                   Schedule sessions during your peak energy hours. Students tend to book slots that align with common study periods.
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           {/* Decorative gradients */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, BookOpen, Plus, Sparkles } from "lucide-react";
import { getToken } from "@/lib/auth";

const formatDateInputValue = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function CreateSlotForm() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<{ date?: string; time?: string; subject?: string }>({});

  const today = new Date();
  const todayStr = formatDateInputValue(today);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 1);
  const maxDateStr = formatDateInputValue(maxDate);
  const nowTimeStr = today.toTimeString().slice(0, 5);

  const validate = (): boolean => {
    const newErrors: { date?: string; time?: string; subject?: string } = {};

    if (!date) {
      newErrors.date = "Please select a date.";
    } else if (date < todayStr) {
      newErrors.date = "Date cannot be in the past.";
    } else if (date > maxDateStr) {
      newErrors.date = "Please select a date within one month from today.";
    }

    if (!time) {
      newErrors.time = "Please select a time.";
    } else if (date === todayStr && time <= nowTimeStr) {
      newErrors.time = "Time must be in the future for today's date.";
    }

    if (!subject.trim()) {
      newErrors.subject = "Please enter a subject.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/tutor-connect/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          time,
          subject,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setSubmitError(message || "Failed to create slot");
        setIsSubmitting(false);
        return;
      }

      setDate("");
      setTime("");
      setSubject("");
      setErrors({});
      router.push("/tutor-connect/slots");
    } catch (error) {
      console.error("Create slot error:", error);
      setSubmitError("Something went wrong while creating the slot.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col items-center justify-start pt-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-sm ring-4 ring-blue-50/50">
            <CalendarDays className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create New Slot
          </h1>
          <p className="text-slate-500 text-[15px]">
            Add a new tutoring session to your schedule
          </p>
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100/80 p-8 sm:p-10 transition-all duration-300 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div className="space-y-2.5">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <CalendarDays className="w-4 h-4 mr-2 text-slate-400" />
                  Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  max={maxDateStr}
                  className={`w-full bg-slate-50/50 border rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm ${
                    errors.date
                      ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                      : "border-slate-200/80 focus:border-blue-500/50"
                  }`}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                />
                {errors.date && (
                  <p className="text-[13px] text-red-500 font-medium mt-1">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  Time
                </label>
                <input
                  type="time"
                  min={date === todayStr ? nowTimeStr : undefined}
                  className={`w-full bg-slate-50/50 border rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm ${
                    errors.time
                      ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                      : "border-slate-200/80 focus:border-blue-500/50"
                  }`}
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }}
                />
                {errors.time && (
                  <p className="text-[13px] text-red-500 font-medium mt-1">{errors.time}</p>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g., Database Systems, Web Development..."
                className={`w-full bg-slate-50/50 border rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] placeholder:text-slate-400/80 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm ${
                  errors.subject
                    ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                    : "border-slate-200/80 focus:border-blue-500/50"
                }`}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setErrors((prev) => ({ ...prev, subject: undefined }));
                }}
              />
              {errors.subject && (
                <p className="text-[13px] text-red-500 font-medium mt-1">{errors.subject}</p>
              )}
            </div>

            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
                {submitError}
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-[14px] transition-all duration-200 font-semibold text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Create Slot</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-[16px] border border-blue-100/50 relative z-10">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 bg-blue-100/80 rounded-xl shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="pt-0.5">
                <h3 className="text-sm font-bold text-blue-900 mb-1">Expert Tip</h3>
                <p className="text-[14px] leading-relaxed text-blue-800/80">
                  Schedule sessions during your peak energy hours. Students tend to book slots that align with common study periods.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
