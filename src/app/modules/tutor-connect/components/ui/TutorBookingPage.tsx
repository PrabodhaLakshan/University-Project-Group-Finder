"use client";
import React, { useState } from "react";
import { Star, Clock, User, Calendar as CalendarIcon, MapPin, ArrowLeft, CheckCircle2, Languages, Award, Users, MessageSquarePlus, X, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOCK_TUTORS = [
  {
    id: 1,
    name: "Nadeesha Perera",
    yearAndSem: "Year 4 Sem 1",
    rating: 4.9,
    reviews: 128,
    availableSlots: [
      { date: 12, time: "10:00 AM" },
      { date: 12, time: "2:00 PM" },
      { date: 14, time: "11:30 AM" },
      { date: 15, time: "5:00 PM" }
    ],

    tags: ["React", "Next.js", "TypeScript"],
    bio: "Passionate about creating modern, accessible web apps and helping students master frontend development. With over 8 years of industry experience, I bring real-world scenarios to my tutoring sessions.",
    imageColor: "from-blue-400 to-indigo-500",
    location: "student area",
    languages: ["English", "Sinhala"],
    education: "BSc Computer Science, MIT"
  },
  {
    id: 2,
    name: "Kasun Madushanka",
    yearAndSem: "Year 3 Sem 2",
    rating: 4.8,
    reviews: 94,
    availableSlots: [
      { date: 13, time: "10:00 AM" },
      { date: 13, time: "3:30 PM" },
      { date: 16, time: "2:00 PM" }
    ],

    tags: ["Node.js", "Python", "System Design"],
    bio: "Focuses on scalable backend architectures and interview preparation for top tech companies. I've conducted over 200 technical interviews.",
    imageColor: "from-emerald-400 to-teal-500",
    location: "student area",
    languages: ["English", "Tamil"],
    education: "MSc Software Engineering, UC Berkeley"
  },
  {
    id: 3,
    name: "Tharushi Senanayake",
    yearAndSem: "Year 2 Sem 2",
    rating: 5.0,
    reviews: 215,
    availableSlots: [
      { date: 12, time: "3:30 PM" },
      { date: 14, time: "10:00 AM" },
      { date: 15, time: "11:30 AM" }
    ],

    tags: ["CSS", "Tailwind", "Figma", "HTML"],
    bio: "I help bridge the gap between design and development. Let's make your apps look beautiful!",
    imageColor: "from-orange-400 to-rose-500",
    location: "student area",
    languages: ["English"],
    education: "Bsc Information Technology"
  },
  {
    id: 4,
    name: "Dulani Wickramasinghe",
    yearAndSem: "Year 4 Sem 2",
    rating: 4.7,
    reviews: 62,
    availableSlots: [
      { date: 15, time: "2:00 PM" },
      { date: 16, time: "10:00 AM" },
      { date: 16, time: "3:30 PM" }
    ],

    tags: ["Machine Learning", "Python", "SQL"],
    bio: "Making complex data problems simple to understand. Great for beginners starting their ML journey.",
    imageColor: "from-violet-400 to-purple-500",
    location: "student area",
    languages: ["English", "sinhala"],
    education: "diploma in IT"
  }
];

export default function TutorBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success">("idle");

  const tutorId = parseInt(params.id) || 1;
  const tutor = MOCK_TUTORS.find(t => t.id === tutorId) || MOCK_TUTORS[0];

  const availableDates = [12, 13, 14, 15, 16];
  const availableTimes = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  const isSlotAvailable = tutor.availableSlots?.some(
    slot => slot.date === selectedDate && slot.time === selectedTime
  );

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackStatusModal, setFeedbackStatusModal] = useState<"idle" | "success">("idle");

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackRating === 0) return;

    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackStatusModal("success");
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackStatusModal("idle");
        setFeedbackRating(0);
        setFeedbackText("");
      }, 2000);
    }, 1000);
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;

    if (isSlotAvailable) {
      setBookingStatus("success");
      setTimeout(() => {
        router.push("/tutor-connect/student-dashboard");
      }, 3000);
    } else {
      router.push("/tutor-connect/waitlist");
    }
  };

  if (bookingStatus === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[28px] shadow-[0_20px_60px_rgba(37,99,235,0.06)] max-w-md w-full text-center border border-slate-100 relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-4 relative z-10">Booking Confirmed!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed relative z-10">
            Your session with <span className="font-bold text-slate-800">{tutor.name}</span> on <span className="font-bold text-slate-800">March {selectedDate}</span> at <span className="font-bold text-slate-800">{selectedTime}</span> has been successfully booked.
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative z-10">
            <div className="bg-emerald-500 h-full animate-[progress_3s_ease-in-out]" style={{ width: '100%' }}></div>
          </div>
          <p className="mt-4 text-sm text-slate-400 font-medium relative z-10">Redirecting to dashboard...</p>

          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes progress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8 pb-20">
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* Back Button */}
        <Link href="/tutor-connect/student-dashboard" className="inline-flex items-center text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors bg-white hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Profile Details (Left Column) */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-slate-100 to-slate-50/50" />

              <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8 mt-4">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${tutor.imageColor} p-1.5 shadow-xl`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white">
                    <User className="w-12 h-12 text-slate-200" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{tutor.name}</h1>
                  <p className="text-emerald-600 font-semibold text-[17px] mb-3">{tutor.yearAndSem}</p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/50">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-2" />
                      <span className="font-bold text-amber-700 text-[14px]">{tutor.rating}</span>
                      <span className="text-amber-600/70 text-xs ml-1 font-medium">({tutor.reviews} reviews)</span>
                    </div>

                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors border border-blue-100 shadow-sm"
                    >
                      <MessageSquarePlus className="w-4 h-4 mr-1.5" />
                      Give Feedback
                    </button>

                    <div className="flex items-center text-slate-600 text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                      {tutor.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">

                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Per Hour</div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    About Me
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-[15px]">
                    {tutor.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-[13px] font-bold tracking-wide border border-slate-200/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <Languages className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Languages</div>
                      <div className="font-semibold text-slate-700 text-sm">{tutor.languages.join(", ")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <Award className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Education</div>
                      <div className="font-semibold text-slate-700 text-sm">{tutor.education}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Booking Widget (Right Column) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-slate-100 sticky top-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-emerald-500" />
                Book a Session
              </h3>

              {/* Date Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-700 text-[14px]">Available Dates</h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">March 2025</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${selectedDate === date
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15)] scale-105"
                        : "border-slate-100 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50"
                        }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][date % 5]}
                      </span>
                      <span className="text-lg font-bold leading-none">{date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-8">
                <h4 className="font-bold text-slate-700 text-[14px] mb-3">Select Time</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      disabled={!selectedDate}
                      className={`py-2.5 px-3 rounded-xl text-[13px] font-bold transition-all border-2 ${!selectedDate
                        ? "opacity-40 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                        : selectedTime === time
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-slate-100 bg-white text-slate-600 hover:border-emerald-200"
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {!selectedDate && (
                  <p className="text-xs font-medium text-amber-500 mt-3 text-center">
                    Please select a date first
                  </p>
                )}
              </div>

              {/* Total & Submit */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-semibold text-sm">Session Total</span>

                </div>

                <button
                  onClick={handleBook}
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full py-4 text-[15px] rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${!selectedDate || !selectedTime
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : isSlotAvailable
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:-translate-y-0.5"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:-translate-y-0.5"
                    }`}
                >
                  {isSlotAvailable ? (
                    <>
                      <Clock className="w-5 h-5" />
                      Confirm Booking
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      Join Waitlist
                    </>
                  )}
                </button>
                <p className="text-center text-[12px] font-medium text-slate-400 mt-4">
                  You won't be charged yet
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmittingFeedback && setShowFeedbackModal(false)}></div>

          <div className="bg-white rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]">
            <div className="p-6 sm:p-8 overflow-y-auto">
              {feedbackStatusModal === "success" ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
                  <p className="text-slate-500 text-[15px]">Your feedback has been successfully submitted and helps {tutor.name} continue to improve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Leave Feedback</h3>
                      <p className="text-slate-500 mt-1 text-[14.5px]">Share your experience with {tutor.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[15px] font-bold text-slate-700 mb-4 text-center">Overall Rating</label>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`w-10 h-10 ${star <= (hoveredRating || feedbackRating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                                } transition-colors duration-200`}
                            />
                          </button>
                        ))}
                      </div>
                      {feedbackRating === 0 ? (
                        <p className="text-slate-400 text-xs mt-3 font-medium text-center">Select your rating to unlock the submit button</p>
                      ) : (
                        <p className="text-amber-500 text-sm mt-3 font-bold text-center">{feedbackRating} out of 5 stars</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="feedback" className="block text-sm font-semibold text-slate-700 mb-2">Detailed Review <span className="text-slate-400 font-normal">(Optional)</span></label>
                      <textarea
                        id="feedback"
                        rows={4}
                        placeholder="What did you like about the session? How could the tutor improve?"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[16px] px-4 py-3.5 text-slate-900 text-[15px] placeholder:text-slate-400 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-200 resize-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={feedbackRating === 0 || isSubmittingFeedback}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${feedbackRating === 0 || isSubmittingFeedback
                        ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                        }`}
                    >
                      {isSubmittingFeedback ? (
                        <div className="w-4 h-4 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isSubmittingFeedback ? "Submitting..." : "Submit Review"}
                    </button>
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
