"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, CalendarDays, CheckCircle2, Clock, Zap, PlusCircle, ClipboardList, Users, TrendingUp } from "lucide-react";

export default function TutorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        <div>
          <Link
            href="/tutor-connect"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] rounded-[24px] p-8 sm:p-10 text-white shadow-[0_8px_30px_rgb(37,99,235,0.15)] relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Tutor Connect Dashboard
              </h1>
              <p className="text-blue-100/90 text-[17px] font-medium max-w-xl">
                Manage your tutoring sessions and student activities seamlessly.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                <div className="bg-white/20 p-2.5 rounded-xl mb-3">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-blue-50 tracking-wide">Welcome back!</div>
              </div>
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>

        {/* Stats Section with modern cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Slots Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group border border-slate-100/80">
            <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] p-4.5 px-6">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 p-2 rounded-xl">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[13px] text-white font-semibold tracking-wide">
                  This Month
                </div>
              </div>
            </div>
            <div className="p-7">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Total Slots
              </h3>
              <p className="text-4xl font-bold text-slate-800 tracking-tight">
                12
              </p>
              <div className="flex items-center mt-4 text-[14px] font-medium text-emerald-500 bg-emerald-50/50 w-fit px-2.5 py-1 rounded-lg">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                <span>20% from last month</span>
              </div>
            </div>
          </div>

          {/* Booked Sessions Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group border border-slate-100/80">
            <div className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] p-4.5 px-6">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 p-2 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[13px] text-white font-semibold tracking-wide">
                  Active
                </div>
              </div>
            </div>
            <div className="p-7">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Booked Sessions
              </h3>
              <p className="text-4xl font-bold text-slate-800 tracking-tight">
                8
              </p>
              <div className="flex items-center mt-4 text-[14px] font-medium text-emerald-500 bg-emerald-50/50 w-fit px-2.5 py-1 rounded-lg">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                <span>67% occupancy rate</span>
              </div>
            </div>
          </div>

          {/* Waitlist Card */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group border border-slate-100/80">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4.5 px-6">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[13px] text-white font-semibold tracking-wide">
                  Pending
                </div>
              </div>
            </div>
            <div className="p-7">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Waitlist Requests
              </h3>
              <p className="text-4xl font-bold text-slate-800 tracking-tight">
                3
              </p>
              <div className="flex items-center mt-4 text-[14px] font-medium text-orange-600 bg-orange-50 w-fit px-2.5 py-1 rounded-lg">
                <Zap className="w-4 h-4 mr-1.5" />
                <span>Needs attention</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions with modern design */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100/80">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Quick Actions
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              href="/tutor-connect/create-slot"
              className="group bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/70 text-blue-950 p-6 rounded-[20px] shadow-sm hover:shadow-[0_8px_30px_rgb(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-5">
                <div className="bg-blue-200/70 rounded-xl p-3.5 shadow-sm">
                  <PlusCircle className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <div className="font-bold text-[17px] mb-0.5 tracking-tight group-hover:text-blue-800 transition-colors">Create New Slot</div>
                  <div className="text-blue-700/80 text-[13.5px] font-medium">Add a new tutoring session</div>
                </div>
              </div>
            </Link>

            <Link
              href="/tutor-connect/slots"
              className="group bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200/70 text-emerald-950 p-6 rounded-[20px] shadow-sm hover:shadow-[0_8px_30px_rgb(34,197,94,0.12)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-5">
                <div className="bg-emerald-200/70 rounded-xl p-3.5 shadow-sm">
                  <ClipboardList className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="font-bold text-[17px] mb-0.5 tracking-tight group-hover:text-emerald-800 transition-colors">View All Slots</div>
                  <div className="text-emerald-700/80 text-[13.5px] font-medium">Manage your schedule</div>
                </div>
              </div>
            </Link>

            <Link
              href="/tutor-connect/bookings"
              className="group bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/60 text-orange-900 p-6 rounded-[20px] shadow-sm hover:shadow-[0_8px_30px_rgb(249,115,22,0.1)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-5">
                <div className="bg-orange-200/60 rounded-xl p-3.5 shadow-sm">
                  <Users className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <div className="font-bold text-[17px] mb-0.5 tracking-tight group-hover:text-orange-800 transition-colors">Manage Bookings</div>
                  <div className="text-orange-700/80 text-[13.5px] font-medium">Handle student requests</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
