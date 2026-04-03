"use client";

import React from "react";
import {
  Hourglass,
  BookOpen,
  Calendar,
  Clock,
  Check,
  MessageSquare,
  X,
  ClipboardList,
  Sparkles,
} from "lucide-react";

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
      studentName: "Sahan Kavindu",
      subject: "Database Systems",
      requestedDate: "2025-03-10",
      requestedTime: "10:00 AM - 11:00 AM",
      priority: "High",
      requestDate: "2025-03-08",
    },
    {
      id: 2,
      studentName: "Dinuki Hansika",
      subject: "Data Structures",
      requestedDate: "2025-03-12",
      requestedTime: "2:00 PM - 3:00 PM",
      priority: "Medium",
      requestDate: "2025-03-09",
    },
    {
      id: 3,
      studentName: "Ashen Lakmal",
      subject: "Web Development",
      requestedDate: "2025-03-15",
      requestedTime: "4:00 PM - 5:00 PM",
      priority: "Low",
      requestDate: "2025-03-10",
    },
  ];

  const getPriorityStyles = (priority: WaitlistRequest["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-600 border-red-100";
      case "Medium":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Low":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 pt-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-10 text-white shadow-[0_10px_40px_rgba(37,99,235,0.25)]">
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Waitlist Requests
              </h1>
              <p className="text-blue-100 text-[17px] font-medium max-w-xl">
                Manage student requests for full tutoring sessions easily.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="min-w-[150px] rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-md shadow-lg">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <Hourglass className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-blue-50 tracking-wide">
                  {waitlistRequests.length} Pending
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl opacity-60" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-300/30 blur-3xl opacity-60" />
        </div>

        {/* List */}
        <div className="space-y-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Recent Requests
            </h2>
          </div>

          <div className="space-y-5">
            {waitlistRequests.length > 0 ? (
              waitlistRequests.map((request) => (
                <div
                  key={request.id}
                  className="group relative rounded-[24px] border border-slate-200/70 bg-white/85 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_35px_rgba(37,99,235,0.10)]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                          {request.studentName.charAt(0)}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
                            {request.studentName}
                          </h3>

                          <div className="mt-0.5 flex items-center text-[14.5px] font-medium text-slate-500">
                            <BookOpen className="mr-1.5 h-4 w-4 text-slate-400" />
                            {request.subject}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${getPriorityStyles(
                          request.priority
                        )}`}
                      >
                        {request.priority} Priority
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-[14px] sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-center rounded-[16px] border border-slate-100 bg-slate-50/90 p-3.5">
                        <div className="mr-3.5 rounded-xl border border-slate-100/70 bg-white p-2 shadow-sm">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <div className="mb-0.5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                            Requested Date
                          </div>
                          <div className="font-semibold text-slate-700">
                            {request.requestedDate}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center rounded-[16px] border border-slate-100 bg-slate-50/90 p-3.5">
                        <div className="mr-3.5 rounded-xl border border-slate-100/70 bg-white p-2 shadow-sm">
                          <Clock className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                          <div className="mb-0.5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                            Preferred Time
                          </div>
                          <div className="font-semibold text-slate-700">
                            {request.requestedTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center rounded-[16px] border border-slate-100 bg-slate-50/90 p-3.5 sm:col-span-2 lg:col-span-1">
                        <div className="mr-3.5 rounded-xl border border-slate-100/70 bg-white p-2 shadow-sm">
                          <Calendar className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div>
                          <div className="mb-0.5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                            Request Date
                          </div>
                          <div className="font-semibold text-slate-700">
                            {request.requestDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                      <button className="flex items-center justify-center gap-2 rounded-[12px] bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-[0_6px_14px_rgba(37,99,235,0.25)] active:scale-[0.98]">
                        <Check className="h-4 w-4" />
                        Approve
                      </button>

                      <button className="flex items-center justify-center gap-2 rounded-[12px] bg-orange-500 px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-[0_6px_14px_rgba(249,115,22,0.22)] active:scale-[0.98]">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </button>

                      <div className="min-w-[10px] flex-1" />

                      <button className="flex items-center justify-center gap-2 rounded-[12px] border border-red-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-red-500 transition-all duration-200 hover:bg-red-50 active:scale-[0.98]">
                        <X className="h-4 w-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="group rounded-[24px] border border-slate-100/80 bg-white py-20 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 transition-colors duration-300 group-hover:bg-blue-50">
                  <ClipboardList className="h-10 w-10 text-slate-300 transition-colors duration-300 group-hover:text-blue-300" />
                </div>

                <h3 className="mb-3 text-[22px] font-bold tracking-tight text-slate-800">
                  No Waitlist Requests
                </h3>

                <p className="mx-auto mb-8 max-w-sm text-[15.5px] leading-relaxed text-slate-500">
                  Students waiting for full sessions will appear here. You're
                  all caught up!
                </p>

                <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-100 bg-emerald-50/80 px-5 py-2.5 text-[14px] text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-bold">
                    Great job staying on top of requests!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}