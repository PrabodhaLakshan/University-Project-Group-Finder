"use client";

import React from "react";
import { BookOpen, Calendar, Clock, Users, Edit3, XCircle, ArrowRightCircle, Sparkles } from "lucide-react";

type Slot = {
  id: number;
  subject: string;
  date: string;
  time: string;
  students: number;
  status: "Available" | "Full";
};

export default function SlotsPage() {
  const slots: Slot[] = [
    {
      id: 1,
      subject: "Database Systems",
      date: "2025-03-10",
      time: "10:00 AM - 11:00 AM",
      students: 2,
      status: "Available",
    },
    {
      id: 2,
      subject: "Data Structures",
      date: "2025-03-12",
      time: "2:00 PM - 3:00 PM",
      students: 5,
      status: "Full",
    },
    {
      id: 3,
      subject: "Web Development",
      date: "2025-03-15",
      time: "4:00 PM - 5:00 PM",
      students: 1,
      status: "Available",
    },
  ];

  return (
    <div className="w-full mx-auto space-y-8 mt-2">
      <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Active Slots
          </h2>
          <p className="text-slate-500 text-[14px] font-medium mt-1">Manage your upcoming tutoring availability</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl font-bold text-[13px] border border-blue-100/50 shadow-sm">
          {slots.length} Total
        </div>
      </div>

      <div className="space-y-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="group bg-white border border-slate-100/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-[20px] p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
          >
            {/* Subtle blue glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent rounded-[20px] transition-colors duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-[17px] font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                      {slot.subject}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 px-3 py-1 text-[12px] uppercase tracking-wide rounded-full font-bold border ${
                      slot.status === "Available"
                        ? "bg-emerald-50/80 text-emerald-600 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center p-2.5 rounded-[12px] bg-slate-50/80 border border-slate-100/80 group-hover:bg-white transition-colors">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2.5" />
                    <span className="text-[14px] font-semibold text-slate-600">{slot.date}</span>
                  </div>

                  <div className="flex items-center p-2.5 rounded-[12px] bg-slate-50/80 border border-slate-100/80 group-hover:bg-white transition-colors">
                    <Clock className="w-4 h-4 text-slate-400 mr-2.5" />
                    <span className="text-[14px] font-semibold text-slate-600">{slot.time}</span>
                  </div>

                  <div className={`flex items-center p-2.5 rounded-[12px] bg-slate-50/80 border border-slate-100/80 group-hover:bg-white transition-colors ${slot.students > 0 ? "text-blue-600" : "text-slate-600"}`}>
                    <Users className={`w-4 h-4 mr-2.5 ${slot.students > 0 ? "text-blue-500" : "text-slate-400"}`} />
                    <span className="text-[14px] font-semibold">
                      {slot.students} student{slot.students !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Column */}
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-[13.5px] font-semibold bg-white text-slate-600 border border-slate-200 rounded-[12px] hover:bg-slate-50 active:scale-[0.98] transition-all">
                  <Edit3 className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-[13.5px] font-semibold bg-white text-red-500 border border-red-200 rounded-[12px] hover:bg-red-50 active:scale-[0.98] transition-all">
                  <XCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>

                {slot.status === "Available" && (
                  <button className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-[13.5px] font-semibold bg-blue-500 text-white rounded-[12px] hover:bg-blue-600 shadow-sm hover:shadow-[0_4px_12px_rgb(37,99,235,0.2)] active:scale-[0.98] transition-all">
                    Details
                    <ArrowRightCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}