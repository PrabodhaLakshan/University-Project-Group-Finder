"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { getToken } from "@/lib/auth";

type BookingApiItem = {
  id: string;
  status: string | null;
  notes?: string | null;
  created_at?: string | null;
  slot: {
    id: string;
    subject: string;
    date: string;
    time: string;
    location?: string | null;
  };
  tutor: {
    student_id: string;
    name: string;
  };
};

type UiBooking = {
  id: string;
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
  const [bookings, setBookings] = useState<UiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showConfirmedToast, setShowConfirmedToast] = useState(false);

  const previousConfirmedIdsRef = useRef<string[]>([]);
  const firstLoadDoneRef = useRef(false);

  const fetchBookings = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        setError("You are not logged in.");
        if (showLoader) {
          setLoading(false);
        }
        return;
      }

      const res = await fetch("/api/tutor-connect/bookings/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Failed to load bookings");
        if (showLoader) {
          setLoading(false);
        }
        return;
      }

      const data: BookingApiItem[] = await res.json();

      const formatted: UiBooking[] = data.map((booking) => {
        const status = normalizeStatus(booking.status);

        return {
          id: booking.id,
          tutorName: booking.tutor.name,
          subject: booking.slot.subject,
          date: formatDate(booking.slot.date),
          time: formatTime(booking.slot.time),
          status,
          duration: "1 hour",
          location: booking.slot.location?.trim() || "Not specified",
          notes: booking.notes ?? undefined,
        };
      });

      const currentConfirmedIds = formatted
        .filter((booking) => booking.status === "Confirmed")
        .map((booking) => booking.id);

      if (firstLoadDoneRef.current) {
        const hasNewConfirmedBooking = currentConfirmedIds.some(
          (id) => !previousConfirmedIdsRef.current.includes(id)
        );

        if (hasNewConfirmedBooking) {
          setShowConfirmedToast(true);

          setTimeout(() => {
            setShowConfirmedToast(false);
          }, 3000);
        }
      }

      previousConfirmedIdsRef.current = currentConfirmedIds;
      firstLoadDoneRef.current = true;

      setBookings(formatted);
    } catch (err) {
      console.error("Fetch student bookings error:", err);
      setError("Something went wrong while loading bookings.");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings(true);

    const interval = setInterval(() => {
      fetchBookings(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Confirmed", color: "blue", Icon: CheckCircle2, status: "Confirmed" },
      { label: "Pending", color: "amber", Icon: Hourglass, status: "Pending" },
      { label: "Completed", color: "indigo", Icon: PartyPopper, status: "Completed" },
      { label: "Cancelled", color: "red", Icon: XCircle, status: "Cancelled" },
    ],
    []
  );

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-500",
    amber: "bg-amber-50 text-amber-500",
    indigo: "bg-indigo-50 text-indigo-500",
    red: "bg-red-50 text-red-500",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-600 border-blue-200/60";
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-200/60";
      case "Completed":
        return "bg-indigo-50 text-indigo-600 border-indigo-200/60";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  const StatusIcon = ({
    status,
    className,
  }: {
    status: string;
    className?: string;
  }) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle2 className={className} />;
      case "Pending":
        return <Hourglass className={className} />;
      case "Completed":
        return <PartyPopper className={className} />;
      case "Cancelled":
        return <XCircle className={className} />;
      default:
        return <ClipboardList className={className} />;
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      setCancelingId(bookingId);
      setError("");

      const token = getToken();

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const res = await fetch(`/api/tutor-connect/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Failed to cancel booking");
        return;
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));

      previousConfirmedIdsRef.current = previousConfirmedIdsRef.current.filter(
        (id) => id !== bookingId
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      setError("Something went wrong while cancelling the booking.");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-[24px] border border-slate-100 p-10 text-center shadow-sm text-slate-500">
            Loading bookings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
      {showConfirmedToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-[0_12px_30px_rgba(16,185,129,0.28)] font-semibold">
          🎉 You got the slot!
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full space-y-8">
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-[20px] p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map(({ label, color, Icon, status }) => (
            <div
              key={label}
              className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 border border-slate-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                  {label}
                </h3>
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

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-slate-100 p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No bookings yet</h3>
            <p className="text-slate-500">
              Your booked tutoring sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-[24px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-100/50 transition-all duration-300 overflow-hidden border border-slate-100/80 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-transparent rounded-[24px] transition-colors duration-500 pointer-events-none" />
                <div className="p-7 relative z-10">
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

                    <div
                      className={`shrink-0 px-4 py-1.5 text-[13px] rounded-full font-bold border flex items-center gap-1.5 ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      <StatusIcon status={booking.status} className="w-4 h-4" />
                      {booking.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[14px] mb-6">
                    {[
                      { Icon: Calendar, label: "Date", value: booking.date },
                      { Icon: Clock, label: "Time", value: booking.time },
                      { Icon: Timer, label: "Duration", value: booking.duration },
                      { Icon: MapPin, label: "Location", value: booking.location, truncate: true },
                    ].map(({ Icon, label, value, truncate }) => (
                      <div
                        key={label}
                        className="flex items-center p-3 rounded-[14px] bg-slate-50/80 border border-slate-100 transition-colors"
                      >
                        <div className="bg-white p-2 text-slate-400 overflow-hidden rounded-xl shadow-sm mr-3 border border-slate-100/50">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                            {label}
                          </div>
                          <div
                            className={`font-semibold text-slate-700 ${
                              truncate ? "truncate max-w-[120px]" : ""
                            }`}
                            title={value}
                          >
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {booking.notes && (
                    <div className="p-4 bg-amber-50/40 rounded-[16px] border border-amber-100/50 mb-6">
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                        <FileText className="w-4 h-4" />
                        Notes
                      </div>
                      <div className="text-[14px] font-medium text-slate-700 leading-relaxed">
                        {booking.notes}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-slate-100">
                    {booking.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancelingId === booking.id}
                        className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-white text-red-500 border border-red-200 rounded-[12px] hover:bg-red-50 transition-all font-semibold active:scale-[0.98] disabled:opacity-60"
                      >
                        <XCircle className="w-4 h-4" />
                        {cancelingId === booking.id ? "Cancelling..." : "Cancel Booking"}
                      </button>
                    )}

                    {booking.status === "Confirmed" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancelingId === booking.id}
                        className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-white text-red-500 border border-red-200 rounded-[12px] hover:bg-red-50 transition-all font-semibold active:scale-[0.98] disabled:opacity-60"
                      >
                        <XCircle className="w-4 h-4" />
                        {cancelingId === booking.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}

                    {booking.status === "Completed" && (
                      <>
                        <button
                          disabled
                          className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-slate-800 text-white rounded-[12px] opacity-70 font-semibold shadow-sm cursor-not-allowed"
                        >
                          <MessageSquareQuote className="w-4 h-4" /> Leave Review
                        </button>
                        <button
                          disabled
                          className="flex items-center gap-2 px-5 py-2.5 text-[14px] bg-white text-blue-600 border border-blue-200 rounded-[12px] opacity-70 font-semibold cursor-not-allowed"
                        >
                          <RefreshCw className="w-4 h-4" /> Book Again
                        </button>
                      </>
                    )}

                    {booking.status === "Cancelled" && (
                      <div className="text-sm font-semibold text-red-500">
                        This booking has been cancelled.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function normalizeStatus(
  status: string | null | undefined
): "Confirmed" | "Pending" | "Completed" | "Cancelled" {
  const value = (status || "").toLowerCase();

  if (value === "confirmed") return "Confirmed";
  if (value === "completed") return "Completed";
  if (value === "cancelled" || value === "canceled") return "Cancelled";
  return "Pending";
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeString: string) {
  return new Date(timeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}