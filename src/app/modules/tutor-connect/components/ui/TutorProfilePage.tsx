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
  MessageSquarePlus,
  Send,
  X,
  CheckCircle2,
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

type FeedbackErrors = {
  rating?: string;
  subject?: string;
  comment?: string;
};

const gradientClasses = [
  "from-blue-400 to-indigo-500",
  "from-sky-400 to-blue-500",
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
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackErrors, setFeedbackErrors] = useState<FeedbackErrors>({});

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

  const resetFeedbackForm = () => {
    setFeedbackRating(0);
    setHoveredRating(0);
    setFeedbackSubject("");
    setFeedbackComment("");
    setFeedbackErrors({});
    setIsSubmittingFeedback(false);
  };

  const closeFeedbackForm = () => {
    if (isSubmittingFeedback) return;
    setShowFeedbackForm(false);
    setFeedbackSuccess("");
    resetFeedbackForm();
  };

  const validateFeedbackForm = (): FeedbackErrors => {
    const errors: FeedbackErrors = {};

    if (feedbackRating === 0) {
      errors.rating = "Please select a rating.";
    }

    if (!feedbackSubject.trim()) {
      errors.subject = "Please choose a subject.";
    }

    const trimmedComment = feedbackComment.trim();

    if (!trimmedComment) {
      errors.comment = "Please enter your feedback.";
    } else if (trimmedComment.length < 10) {
      errors.comment = "Feedback must be at least 10 characters.";
    } else if (trimmedComment.length > 300) {
      errors.comment = "Feedback must be less than 300 characters.";
    }

    return errors;
  };

  const handleSubmitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateFeedbackForm();
    setFeedbackErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setFeedbackSuccess("");
    setIsSubmittingFeedback(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFeedbackRating(0);
      setHoveredRating(0);
      setFeedbackSubject("");
      setFeedbackComment("");
      setFeedbackErrors({});
      setFeedbackSuccess("Your feedback has been recorded successfully.");

      setTimeout(() => {
        setShowFeedbackForm(false);
        setFeedbackSuccess("");
      }, 1800);
    } catch (err) {
      console.error("Feedback submit error:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 pt-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div>
          <Link
            href="/tutor-connect/student-dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700"
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
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:items-center">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <div
                      className={`w-28 h-28 rounded-full bg-gradient-to-br ${gradient} p-1 shadow-md`}
                    >
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

                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackSuccess("");
                        setFeedbackErrors({});
                        setShowFeedbackForm(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      <span>Give Feedback</span>
                    </button>
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

                    <p className="text-blue-100 font-semibold text-[15px] mb-4">
                      {tutor.yearAndSem}
                    </p>

                    <p className="text-blue-50/95 text-[15px] leading-relaxed max-w-3xl">
                      {tutor.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
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
                            <Languages className="w-4 h-4 text-blue-500" />
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
                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                        <span>{tutor.reviews_count ?? 0} review(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>{tutor.subjects.length} subject(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-blue-500" />
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
              <div className="bg-blue-50 border border-blue-200 rounded-[20px] p-4 text-blue-700">
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

                <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-bold border border-blue-200">
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
                            <BookOpen className="w-4 h-4 text-blue-500 mr-2.5" />
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
                            <CalendarDays className="w-4 h-4 text-blue-500 mr-2.5" />
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
                            <Clock className="w-4 h-4 text-blue-500 mr-2.5" />
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

                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                          <button
                            type="button"
                            className="min-w-[150px] bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-3 rounded-xl text-sm font-bold transition-all border border-blue-200 shadow-sm"
                          >
                            Join Waitlist
                          </button>
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

      {showFeedbackForm && tutor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <button
            type="button"
            aria-label="Close feedback form overlay"
            onClick={closeFeedbackForm}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          <div className="relative z-10 flex max-h-[calc(100vh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)] sm:max-h-[calc(100vh-2rem)]">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 px-5 py-5 text-white sm:px-6 sm:py-5">
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 left-10 h-20 w-20 rounded-full bg-sky-200/20 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-blue-100">
                    Student Review
                  </p>
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Share feedback for {tutor.name}
                  </h3>
                  <p className="mt-1.5 max-w-lg text-sm text-blue-100/90">
                    Your thoughts help this tutor improve future sessions for students.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeFeedbackForm}
                  disabled={isSubmittingFeedback}
                  className="rounded-full border border-white/15 bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              {feedbackSuccess ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Feedback sent</h4>
                  <p className="mt-2 text-sm text-slate-500">{feedbackSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-sm font-bold text-slate-700">Overall rating</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                        Pick a score based on your tutoring experience.
                      </p>

                      <div className="mt-4 flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => {
                              setFeedbackRating(star);
                              setFeedbackErrors((prev) => ({
                                ...prev,
                                rating: undefined,
                              }));
                            }}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`h-8 w-8 sm:h-9 sm:w-9 ${
                                star <= (hoveredRating || feedbackRating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        {feedbackRating === 0
                          ? "Select a rating to continue."
                          : `${feedbackRating} out of 5 stars`}
                      </p>

                      {feedbackErrors.rating && (
                        <p className="mt-2 text-sm font-medium text-red-500">
                          {feedbackErrors.rating}
                        </p>
                      )}
                    </div>

                    <div className="rounded-[20px] border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-4">
                      <p className="text-sm font-bold text-slate-700">Quick notes</p>
                      <div className="mt-3 space-y-2.5 text-sm text-slate-600">
                        <div className="rounded-xl border border-white/70 bg-white/70 px-3.5 py-2.5">
                          Clear explanations
                        </div>
                        <div className="rounded-xl border border-white/70 bg-white/70 px-3.5 py-2.5">
                          Helpful examples
                        </div>
                        <div className="rounded-xl border border-white/70 bg-white/70 px-3.5 py-2.5">
                          Friendly and engaging session
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="feedback-subject"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Subject
                    </label>
                    <select
                      id="feedback-subject"
                      value={feedbackSubject}
                      onChange={(e) => {
                        setFeedbackSubject(e.target.value);
                        setFeedbackErrors((prev) => ({
                          ...prev,
                          subject: undefined,
                        }));
                      }}
                      className={`w-full rounded-[16px] px-4 py-2.5 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 ${
                        feedbackErrors.subject
                          ? "border border-red-300 bg-red-50 text-slate-700 focus:border-red-400 focus:ring-red-500/10"
                          : "border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400 focus:ring-blue-500/10"
                      }`}
                    >
                      <option value="">Choose a subject</option>
                      {tutor.subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>

                    {feedbackErrors.subject && (
                      <p className="text-sm font-medium text-red-500">
                        {feedbackErrors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="feedback-comment"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Your feedback
                    </label>
                    <textarea
                      id="feedback-comment"
                      rows={4}
                      value={feedbackComment}
                      onChange={(e) => {
                        setFeedbackComment(e.target.value);
                        setFeedbackErrors((prev) => ({
                          ...prev,
                          comment: undefined,
                        }));
                      }}
                      placeholder="Write a few words about the tutor's teaching style, clarity, and how helpful the session was."
                      className={`w-full resize-none rounded-[18px] px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                        feedbackErrors.comment
                          ? "border border-red-300 bg-red-50 text-slate-700 focus:border-red-400 focus:ring-red-500/10"
                          : "border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400 focus:ring-blue-500/10"
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      {feedbackErrors.comment ? (
                        <p className="text-sm font-medium text-red-500">
                          {feedbackErrors.comment}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400">
                          Minimum 10 characters, maximum 300 characters.
                        </p>
                      )}

                      <p
                        className={`text-sm ${
                          feedbackComment.trim().length > 300
                            ? "text-red-500"
                            : "text-slate-400"
                        }`}
                      >
                        {feedbackComment.trim().length}/300
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeFeedbackForm}
                        disabled={isSubmittingFeedback}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingFeedback}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all ${
                          isSubmittingFeedback
                            ? "cursor-not-allowed bg-blue-300"
                            : "bg-blue-600 shadow-lg shadow-blue-200 hover:bg-blue-700"
                        }`}
                      >
                        {isSubmittingFeedback ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        <span>
                          {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
