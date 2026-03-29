"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  User,
  Languages,
  BookOpen,
  Clock,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
import { getToken } from "@/lib/auth";

type TutorSlot = {
  id: string;
  subject: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean | null;
};

type TutorProfile = {
  id: string;
  student_id: string;
  name: string;
  yearAndSem: string;
  bio: string | null;
  subjects: string[];
  language: string[];
  expertise: string[];
  ratings: number;
  reviews_count: number;
  slots: TutorSlot[];
};

type Props = {
  tutorId: string;
};

const gradientClasses = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-rose-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-sky-500",
  "from-pink-400 to-rose-500",
];

export default function TutorProfilePage({ tutorId }: Props) {
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  useEffect(() => {
    const loadTutor = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/tutor-connect/tutors/${tutorId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const message = await res.text();
          setError(message || "Failed to load tutor profile");
          setLoading(false);
          return;
        }

        const data: TutorProfile = await res.json();
        setTutor(data);
      } catch (err) {
        console.error("Load tutor profile error:", err);
        setError("Something went wrong while loading tutor profile.");
      } finally {
        setLoading(false);
      }
    };

    loadTutor();
  }, [tutorId]);

  const gradient = useMemo(() => {
    const code = tutorId
      .split("")
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return gradientClasses[code % gradientClasses.length];
  }, [tutorId]);

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const timeObj = new Date(timeString);
    return timeObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBookNow = async (slotId: string) => {
    try {
      setBookingError("");
      setBookingSuccess("");
      setBookingSlotId(slotId);

      const token = getToken();

      if (!token) {
        setBookingError("You must be logged in to make a booking.");
        setBookingSlotId(null);
        return;
      }

      const res = await fetch("/api/tutor-connect/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slot_id: slotId,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setBookingError(message || "Failed to create booking");
        setBookingSlotId(null);
        return;
      }

      setBookingSuccess("Booking created successfully.");

      setTutor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          slots: prev.slots.filter((slot) => slot.id !== slotId),
        };
      });
    } catch (err) {
      console.error("Book slot error:", err);
      setBookingError("Something went wrong while booking this slot.");
    } finally {
      setBookingSlotId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 pt-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div>
          <Link
            href="/tutor-connect/student-dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-200 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tutors</span>
          </Link>
        </div>

        {loading && (
          <div className="bg-white rounded-[24px] border border-slate-100 p-10 text-center shadow-sm text-slate-500">
            Loading tutor profile...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-[20px] p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && tutor && (
          <>
            <div className="bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:items-center">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${gradient} p-1 shadow-md`}>
                      <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center border-2 border-white">
                        <User className="w-12 h-12 text-slate-300" />
                      </div>
                    </div>

                    <div className="flex items-center bg-white/15 px-3 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-amber-300 fill-amber-300 mr-1.5" />
                      <span className="font-bold text-sm">
                        {Number(tutor.ratings ?? 0).toFixed(1)}
                      </span>
                      <span className="text-white/80 text-xs ml-1">
                        ({tutor.reviews_count ?? 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        {tutor.name}
                      </h1>

                      <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20">
                        Tutor Profile
                      </span>
                    </div>

                    <p className="text-emerald-100 font-semibold text-[15px] mb-4">
                      {tutor.yearAndSem}
                    </p>

                    <p className="text-emerald-50/95 text-[15px] leading-relaxed max-w-3xl">
                      {tutor.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              </div>

              <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-50 rounded-[20px] border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                      Subjects
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.length > 0 ? (
                        tutor.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="bg-white text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200"
                          >
                            {subject}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">No subjects added yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[20px] border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                      Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tutor.expertise.length > 0 ? (
                        tutor.expertise.map((item) => (
                          <span
                            key={item}
                            className="bg-white text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">No expertise added yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-[20px] border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                      Languages
                    </h2>
                    {tutor.language.length > 0 ? (
                      <div className="space-y-3">
                        {tutor.language.map((lang) => (
                          <div
                            key={lang}
                            className="flex items-center gap-2 text-slate-700 font-medium"
                          >
                            <Languages className="w-4 h-4 text-emerald-500" />
                            <span>{lang}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">No languages added yet.</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-[20px] border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                      Profile Summary
                    </h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-700">
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                        <span>{tutor.reviews_count ?? 0} review(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <span>{tutor.subjects.length} subject(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span>{tutor.slots.length} available slot(s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {bookingError && (
              <div className="bg-red-50 border border-red-200 rounded-[20px] p-4 text-red-600">
                {bookingError}
              </div>
            )}

            {bookingSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-[20px] p-4 text-emerald-700">
                {bookingSuccess}
              </div>
            )}

            <div className="bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Available Slots
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Choose a suitable time and create your booking.
                  </p>
                </div>

                <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-sm font-bold border border-emerald-200">
                  {tutor.slots.length} Slot(s)
                </div>
              </div>

              {tutor.slots.length === 0 ? (
                <div className="bg-slate-50 rounded-[20px] border border-slate-100 p-10 text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    No available slots
                  </h3>
                  <p className="text-slate-500">
                    This tutor has no open sessions right now.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tutor.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="group bg-slate-50 border border-slate-100 rounded-[20px] p-5 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center p-3 rounded-[14px] bg-white border border-slate-100">
                            <BookOpen className="w-4 h-4 text-emerald-500 mr-2.5" />
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                Subject
                              </p>
                              <p className="text-sm font-semibold text-slate-700">
                                {slot.subject}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center p-3 rounded-[14px] bg-white border border-slate-100">
                            <CalendarDays className="w-4 h-4 text-emerald-500 mr-2.5" />
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                Date
                              </p>
                              <p className="text-sm font-semibold text-slate-700">
                                {formatDate(slot.slot_date)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center p-3 rounded-[14px] bg-white border border-slate-100">
                            <Clock className="w-4 h-4 text-emerald-500 mr-2.5" />
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                Time
                              </p>
                              <p className="text-sm font-semibold text-slate-700">
                                {formatTime(slot.slot_time)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleBookNow(slot.id)}
                            disabled={bookingSlotId === slot.id}
                            className="min-w-[150px] bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-60"
                          >
                            {bookingSlotId === slot.id ? "Booking..." : "Book Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}