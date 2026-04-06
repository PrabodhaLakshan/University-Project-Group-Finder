"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  CalendarDays,
  CheckCircle2,
  Clock,
  Zap,
  PlusCircle,
  ClipboardList,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Star,
  Hourglass,
} from "lucide-react";
import { getToken } from "@/lib/auth";

type DashboardStats = {
  totalSlots: number;
  bookedSessions: number;
  waitlistRequests: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  occupancyRate: number;
  averageRating: number;
  reviewsCount: number;
};

export default function TutorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSlots: 0,
    bookedSessions: 0,
    waitlistRequests: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    occupancyRate: 0,
    averageRating: 0,
    reviewsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/tutor-connect/dashboard/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          const message = await res.text();
          setError(message || "Failed to load dashboard stats");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Load dashboard stats error:", err);
        setError("Something went wrong while loading dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden p-6 pt-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full mix-blend-multiply blur-[100px]" />
        <div className="absolute top-[20%] right-[15%] w-[280px] h-[280px] bg-orange-300/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <Link
            href="/tutor-connect"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#2563EB] to-[#1E40AF] p-8 sm:p-10 text-white shadow-[0_20px_50px_rgba(37,99,235,0.22)]">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-50 backdrop-blur-md mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Tutor Workspace
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Tutor Connect Dashboard
              </h1>

              <p className="max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-blue-100/90">
                Manage your tutoring sessions, monitor student bookings, and keep
                track of your availability from one beautiful dashboard.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="min-w-[200px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md shadow-lg">
                <div className="mb-3 inline-flex rounded-xl bg-white/15 p-3">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm font-semibold text-white">Welcome back!</p>
                <p className="mt-1 text-xs text-blue-100/80">
                  Rating {stats.averageRating.toFixed(1)} • {stats.reviewsCount} reviews
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl opacity-60 -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-cyan-300/10 blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[20px] p-4 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-[24px] border border-slate-100 p-10 text-center shadow-sm text-slate-500">
            Loading dashboard stats...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group overflow-hidden rounded-[24px] border border-white bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)]">
                <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] p-5">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-white/20 p-2.5">
                      <CalendarDays className="h-5 w-5 text-white" />
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-semibold text-white">
                      Total
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400">
                    Total Slots
                  </h3>
                  <p className="text-4xl font-bold tracking-tight text-slate-800">
                    {stats.totalSlots}
                  </p>

                  <div className="mt-4 inline-flex items-center rounded-lg bg-emerald-50/80 px-3 py-1.5 text-[14px] font-medium text-emerald-600">
                    <TrendingUp className="mr-1.5 h-4 w-4" />
                    <span>{stats.occupancyRate}% occupancy rate</span>
                  </div>
                </div>
              </div>

              <div className="group overflow-hidden rounded-[24px] border border-white bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)]">
                <div className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] p-5">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-white/20 p-2.5">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-semibold text-white">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400">
                    Booked Sessions
                  </h3>
                  <p className="text-4xl font-bold tracking-tight text-slate-800">
                    {stats.bookedSessions}
                  </p>

                  <div className="mt-4 inline-flex items-center rounded-lg bg-emerald-50/80 px-3 py-1.5 text-[14px] font-medium text-emerald-600">
                    <TrendingUp className="mr-1.5 h-4 w-4" />
                    <span>{stats.confirmedBookings} confirmed</span>
                  </div>
                </div>
              </div>

              <div className="group overflow-hidden rounded-[24px] border border-white bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)]">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-white/20 p-2.5">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-semibold text-white">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="mb-2 text-[13px] font-bold uppercase tracking-wider text-slate-400">
                    Waitlist Requests
                  </h3>
                  <p className="text-4xl font-bold tracking-tight text-slate-800">
                    {stats.waitlistRequests}
                  </p>

                  <div className="mt-4 inline-flex items-center rounded-lg bg-orange-50 px-3 py-1.5 text-[14px] font-medium text-orange-600">
                    <Zap className="mr-1.5 h-4 w-4" />
                    <span>{stats.pendingBookings} pending bookings</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-400">
                    Confirmed
                  </h3>
                  <div className="bg-blue-50 p-2.5 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-800">
                  {stats.confirmedBookings}
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-400">
                    Completed
                  </h3>
                  <div className="bg-indigo-50 p-2.5 rounded-xl">
                    <ClipboardList className="w-5 h-5 text-indigo-500" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-800">
                  {stats.completedBookings}
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-400">
                    Average Rating
                  </h3>
                  <div className="bg-amber-50 p-2.5 rounded-xl">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-slate-800">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  {stats.reviewsCount} review(s)
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white bg-white/70 p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-800">
                    Quick Actions
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Jump quickly into the most important tasks.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Link
                  href="/tutor-connect/create-slot"
                  className="group rounded-[20px] border border-blue-200/70 bg-gradient-to-br from-blue-50 to-blue-100/70 p-6 text-blue-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(37,99,235,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-xl bg-blue-200/70 p-3.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <PlusCircle className="h-6 w-6 text-blue-700" />
                      </div>

                      <div>
                        <div className="mb-1 text-[17px] font-bold tracking-tight transition-colors group-hover:text-blue-800">
                          Create New Slot
                        </div>
                        <div className="text-[13.5px] font-medium text-blue-700/80">
                          Add a new tutoring session
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href="/tutor-connect/slots"
                  className="group rounded-[20px] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-emerald-100/70 p-6 text-emerald-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(34,197,94,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-xl bg-emerald-200/70 p-3.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <ClipboardList className="h-6 w-6 text-emerald-700" />
                      </div>

                      <div>
                        <div className="mb-1 text-[17px] font-bold tracking-tight transition-colors group-hover:text-emerald-800">
                          View All Slots
                        </div>
                        <div className="text-[13.5px] font-medium text-emerald-700/80">
                          Manage your schedule
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href="/tutor-connect/bookings"
                  className="group rounded-[20px] border border-orange-200/60 bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 text-orange-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(249,115,22,0.10)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-xl bg-orange-200/60 p-3.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Users className="h-6 w-6 text-orange-700" />
                      </div>

                      <div>
                        <div className="mb-1 text-[17px] font-bold tracking-tight transition-colors group-hover:text-orange-800">
                          Manage Bookings
                        </div>
                        <div className="text-[13.5px] font-medium text-orange-700/80">
                          Handle student requests
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-orange-500 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-50 p-2 rounded-xl">
                    <Hourglass className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-slate-800">Pending Bookings</h3>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                  Students waiting for your approval.
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.pendingBookings}
                </p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-50 p-2 rounded-xl">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-slate-800">Waitlist Queue</h3>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                  Students waiting for booked sessions.
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.waitlistRequests}
                </p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-slate-800">Performance</h3>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                  Overall slot usage and session activity.
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.occupancyRate}%
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}