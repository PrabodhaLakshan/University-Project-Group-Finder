"use client";

import React from "react";
import {
  CheckCircle2,
  Hourglass,
  PartyPopper,
  XCircle,
  ClipboardList,
  BookOpen,
  Calendar,
  Clock,
  Timer,
  MapPin,
  FileText,
  RefreshCw,
  MessageSquareQuote,
} from "lucide-react";

type Booking = {
  id: number;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  duration: string;
  location: string;
  notes?: string;
};

export default function StudentBookingsPage() {
  const bookings: Booking[] = [
    {
      id: 1,
      tutorName: "Nadeesha Perera",
      subject: "React & Next.js",
      date: "2025-03-10",
      time: "10:00 AM – 11:00 AM",
      status: "Confirmed",
      duration: "1 hour",
      location: "Library – Room 204",
      notes: "Focus on Next.js App Router and server components.",
    },
    {
      id: 2,
      tutorName: "Kasun Madushanka",
      subject: "System Design",
      date: "2025-03-12",
      time: "2:00 PM – 3:30 PM",
      status: "Pending",
      duration: "1.5 hours",
      location: "Study Hall – Room 101",
      notes: "Review scalability patterns and load balancing.",
    },
    {
      id: 3,
      tutorName: "Tharushi Senanayake",
      subject: "CSS & Tailwind",
      date: "2025-03-08",
      time: "4:00 PM – 5:00 PM",
      status: "Completed",
      duration: "1 hour",
      location: "Computer Lab – Building A",
      notes: "Covered Flexbox, Grid, and responsive design.",
    },
    {
      id: 4,
      tutorName: "Dulani Wickramasinghe",
      subject: "Machine Learning",
      date: "2025-03-05",
      time: "3:00 PM – 4:00 PM",
      status: "Cancelled",
      duration: "1 hour",
      location: "Study Room B – 2nd Floor",
      notes: "Cancelled due to a scheduling conflict.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":  return "bg-blue-50 text-blue-600 border-blue-200/60";
      case "Pending":    return "bg-amber-50 text-amber-600 border-amber-200/60";
      case "Completed":  return "bg-indigo-50 text-indigo-600 border-indigo-200/60";
      case "Cancelled":  return "bg-red-50 text-red-600 border-red-200/60";
      default:           return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  const StatusIcon = ({ status, className }: { status: string; className?: string }) => {
    switch (status) {
      case "Confirmed":  return <CheckCircle2 className={className} />;
      case "Pending":    return <Hourglass className={className} />;
      case "Completed":  return <PartyPopper className={className} />;
      case "Cancelled":  return <XCircle className={className} />;
      default:           return <ClipboardList className={className} />;
    }
  };

  const stats = [
    { label: "Confirmed", color: "blue", Icon: CheckCircle2, status: "Confirmed" },
    { label: "Pending",   color: "amber",  Icon: Hourglass,    status: "Pending" },
    { label: "Completed", color: "indigo", Icon: PartyPopper,  status: "Completed" },
    { label: "Cancelled", color: "red",    Icon: XCircle,      status: "Cancelled" },
  ];

  const colorMap: Record<string, string> = {
    blue:    "bg-blue-50 text-blue-500",
    amber:   "bg-amber-50 text-amber-500",
    indigo:  "bg-indigo-50 text-indigo-500",
    red:     "bg-red-50 text-red-500",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
      <div className="max-w-7xl mx-auto w-full space-y-8">

        {/* Header - Updated to Blue Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[24px] p-8 sm:p-10 text-white shadow-[0_8px_30px_rgb(37,99,235,0.15)] relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">My Bookings</h1>
              <p className="text-blue-100/90 text-[17px] font-medium max-w-xl">
                Track your tutoring sessions and upcoming appointments.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                <div className="bg-white/20 p-2.5 rounded-xl mb-3">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-blue-50 tracking-wide uppercase">
                  {bookings.length} Total Sessions
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map(({ label, color, Icon, status }) => (
            <div key={label} className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 border border-slate-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{label}</h3>
                <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-800 tracking-tight">
                {bookings.filter((b) => b.status === status).length}
              </div>
            </div>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-[24px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-100/50 transition-all duration-300 overflow-hidden border border-slate-100/80 group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-transparent rounded-[24px] transition-colors duration-500 pointer-events-none" />
              <div className="p-7 relative z-10">

                {/* Top row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {booking.tutorName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                        {booking.tutorName}
                      </h3>
                      <div className="text-[14px] font-medium text-slate-500 mt-1 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1.5 text-blue-500" />
                        {booking.subject}
                      </div>
                    </div>
                  </div>

                  <div className={`shrink-0 px-4 py-1.5 text-[13px] rounded-full font-bold border flex items-center gap-1.5 ${getStatusColor(booking.status)}`}>
                    <StatusIcon status={booking.status} className="w-4 h-4" />
                    {booking.status}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[14px] mb-6">
                  {[
                    { Icon: Calendar, label: "Date",     value: booking.date },
                    { Icon: Clock,    label: "Time",     value: booking.time },
                    { Icon: Timer,    label: "Duration", value: booking.duration },
                    { Icon: MapPin,   label: "Location", value: booking.location, truncate: true },
                  ].map(({ Icon, label, value, truncate }) => (
                    <div key={label} className="flex items-center p-3 rounded-[14px] bg-slate-50/80 border border-slate-100 transition-colors">
                      <div className="bg-white p-2 text-slate-400 overflow-hidden rounded-xl shadow-sm mr-3 border border-slate-100/50">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
                        <div className={`font-semibold text-slate-700 ${truncate ? "truncate max-w-[120px]" : ""}`} title={value}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="p-4 bg-amber-50/40 rounded-[16px] border border-amber-100/50 mb-6">
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                      <FileText className="w-4 h-4" />
                      Notes
                    </div>
                    <div className="text-[14px] font-medium text-slate-700 leading-relaxed">{booking.notes}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100">
                  {booking.status === "Pending" && (
                    <button className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-white text-red-500 border border-red-200 rounded-[12px] hover:bg-red-50 transition-all font-semibold active:scale-[0.98]">
                      <XCircle className="w-4 h-4" /> Cancel Booking
                    </button>
                  )}
                  {booking.status === "Confirmed" && (
                    <button className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-white text-red-500 border border-red-200 rounded-[12px] hover:bg-red-50 transition-all font-semibold active:scale-[0.98]">
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  )}
                  {booking.status === "Completed" && (
                    <>
                      <button className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-slate-800 text-white rounded-[12px] hover:bg-slate-900 transition-all font-semibold shadow-sm active:scale-[0.98]">
                        <MessageSquareQuote className="w-4 h-4" /> Leave Review
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-white text-blue-600 border border-blue-200 rounded-[12px] hover:bg-blue-50 transition-all font-semibold active:scale-[0.98]">
                        <RefreshCw className="w-4 h-4" /> Book Again
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}