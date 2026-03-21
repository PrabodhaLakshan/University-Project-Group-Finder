"use client";

import React from "react";
import { Hourglass, BookOpen, Calendar, Clock, Check, MessageSquare, X, ClipboardList, Sparkles } from "lucide-react";

type WaitlistRequest = {
  id: number;
  studentName: string;
  subject: string;
  requestedDate: string;
  requestedTime: string;
  priority: "High" | "Medium" | "Low";
  requestDate: string;
};

export default function WaitlistPage() {
  const waitlistRequests: WaitlistRequest[] = [
    {
      id: 1,
      studentName: "Alice Johnson",
      subject: "Database Systems",
      requestedDate: "2025-03-10",
      requestedTime: "10:00 AM - 11:00 AM",
      priority: "High",
      requestDate: "2025-03-08",
    },
    {
      id: 2,
      studentName: "Bob Smith",
      subject: "Data Structures",
      requestedDate: "2025-03-12",
      requestedTime: "2:00 PM - 3:00 PM",
      priority: "Medium",
      requestDate: "2025-03-09",
    },
    {
      id: 3,
      studentName: "Carol Davis",
      subject: "Web Development",
      requestedDate: "2025-03-15",
      requestedTime: "4:00 PM - 5:00 PM",
      priority: "Low",
      requestDate: "2025-03-10",
    },
  ];


  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header with lighter orange background */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-[24px] p-8 sm:p-10 text-white shadow-[0_8px_30px_rgb(251,146,60,0.2)] relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Waitlist Requests
              </h1>
              <p className="text-orange-50 text-[17px] font-medium max-w-xl">
                Manage student requests for full tutoring sessions easily.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                <div className="bg-white/20 p-2.5 rounded-xl mb-3">
                  <Hourglass className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-orange-50 tracking-wide">{waitlistRequests.length} Pending</div>
              </div>
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/30 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>

        {/* Waitlist List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Recent Requests</h2>
          </div>

          <div className="space-y-5">
            {waitlistRequests.length > 0 ? (
              waitlistRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white border border-slate-100/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-[24px] p-7 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-orange-200/50 transition-all duration-300 group relative"
                >
                  {/* Subtle light orange glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-50/0 to-orange-50/0 group-hover:from-orange-50/50 group-hover:to-transparent rounded-[24px] transition-colors duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                          {request.studentName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-orange-500 transition-colors tracking-tight">
                            {request.studentName}
                          </h3>
                          <div className="text-[14.5px] font-medium text-slate-500 mt-0.5 flex items-center">
                            <BookOpen className="w-4 h-4 mr-1.5 text-slate-400" />
                            {request.subject}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                      <div className="flex items-center p-3 rounded-[14px] bg-slate-50/80 border border-slate-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm mr-3.5 border border-slate-100/50">
                          <Calendar className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-[12.5px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Requested Date</div>
                          <div className="font-semibold text-slate-700">{request.requestedDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 rounded-[14px] bg-slate-50/80 border border-slate-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm mr-3.5 border border-slate-100/50">
                          <Clock className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-[12.5px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Preferred Time</div>
                          <div className="font-semibold text-slate-700">{request.requestedTime}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-slate-100">
                      <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-[12px] transition-all duration-200 font-semibold shadow-sm hover:shadow-[0_4px_12px_rgb(16,185,129,0.2)] active:scale-[0.98]">
                        <Check className="w-4 h-4" />
                        Approve
                      </button>

                      <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] bg-slate-800 hover:bg-slate-900 text-white rounded-[12px] transition-all duration-200 font-semibold shadow-sm hover:shadow-[0_4px_12px_rgb(15,23,42,0.2)] active:scale-[0.98]">
                        <MessageSquare className="w-4 h-4" />
                        Message 
                      </button>

                      <div className="flex-1 min-w-[10px]" />

                      <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] bg-white text-red-500 border border-red-200 rounded-[12px] hover:bg-red-50 transition-all duration-200 font-semibold active:scale-[0.98]">
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 group">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-50 transition-colors duration-300">
                  <ClipboardList className="w-10 h-10 text-slate-300 group-hover:text-orange-300 transition-colors duration-300" />
                </div>
                <h3 className="text-[22px] font-bold text-slate-800 tracking-tight mb-3">
                  No Waitlist Requests
                </h3>
                <p className="text-slate-500 text-[15.5px] max-w-sm mx-auto mb-8 leading-relaxed">
                  Students waiting for full sessions will appear here. You're all caught up!
                </p>
                <div className="inline-flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-100 text-emerald-600 px-5 py-2.5 rounded-full text-[14px]">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold">Great job staying on top of requests!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}