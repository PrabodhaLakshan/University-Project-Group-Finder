"use client";

import { useState } from "react";
import { CalendarDays, Clock, BookOpen, Plus, Sparkles } from "lucide-react";

export default function CreateSlotForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log({ date, time, subject });
      alert("Slot Created Successfully!");
      setIsSubmitting(false);
      setDate("");
      setTime("");
      setSubject("");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col items-center justify-start pt-12">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
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

        {/* Form Container */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100/80 p-8 sm:p-10 transition-all duration-300 relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {/* Date Input */}
              <div className="space-y-2.5">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <CalendarDays className="w-4 h-4 mr-2 text-slate-400" />
                  Date
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-200 shadow-sm"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Time Input */}
              <div className="space-y-2.5">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  Time
                </label>
                <div className="relative group">
                  <input
                    type="time"
                    className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-200 shadow-sm"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-2.5">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                Subject
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="e.g., Database Systems, Web Development..."
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] px-4 py-3.5 text-slate-900 text-[15px] placeholder:text-slate-400/80 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-200 shadow-sm"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-[14px] transition-all duration-200 font-semibold text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] active:scale-[0.98] disabled:opacity-70 disabled:hover:shadow-none"
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

          {/* Additional Info */}
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
          
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}