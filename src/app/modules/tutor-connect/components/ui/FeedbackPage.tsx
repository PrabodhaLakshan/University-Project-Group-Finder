"use client";

import React from "react";
import { Star, MessageSquareQuote, BarChart3, BookOpen, Calendar, Clock, ThumbsUp, MessageCircle, AlertCircle } from "lucide-react";

type Feedback = {
  id: number;
  studentName: string;
  subject: string;
  rating: number;
  date: string;
  comment: string;
  sessionDate: string;
  helpful: number;
};

export default function FeedbackPage() {
  const feedbacks: Feedback[] = [
    {
      id: 1,
      studentName: "Sahan Kavindu",
      subject: "Database Systems",
      rating: 5,
      date: "2025-03-08",
      sessionDate: "2025-03-10",
      comment: "Excellent tutor! Explained complex SQL concepts in a very clear and understandable way. The examples were practical and helped me grasp database design principles quickly.",
      helpful: 12,
    },
    {
      id: 2,
      studentName: "Dinuki Hansika",
      subject: "Data Structures",
      rating: 4,
      date: "2025-03-09",
      sessionDate: "2025-03-12",
      comment: "Great session on linked lists and trees. The visual diagrams were very helpful. Would have liked more practice problems, but overall very satisfied.",
      helpful: 8,
    },
    {
      id: 3,
      studentName: "Ashen Lakmal",
      subject: "Web Development",
      rating: 5,
      date: "2025-03-08",
      sessionDate: "2025-03-08",
      comment: "Amazing tutor! Made React hooks so easy to understand. The hands-on approach and real-time coding examples were exactly what I needed. Highly recommend!",
      helpful: 15,
    },
    {
      id: 4,
      studentName: "Pabasara Dilshan",
      subject: "Algorithm Design",
      rating: 4,
      date: "2025-03-10",
      sessionDate: "2025-03-15",
      comment: "Very knowledgeable about algorithms. The dynamic programming explanation was thorough. Sometimes goes a bit fast, but always willing to slow down and clarify.",
      helpful: 6,
    },
    {
      id: 5,
      studentName: "Hasini Madubhashini",
      subject: "Machine Learning",
      rating: 5,
      date: "2025-03-05",
      sessionDate: "2025-03-03",
      comment: "Outstanding teaching style! Breaks down complex ML concepts into simple, digestible parts. The practical examples with real datasets were incredibly valuable.",
      helpful: 18,
    },
    {
      id: 6,
      studentName: "Thilina Sandaruwan",
      subject: "Python Programming",
      rating: 3,
      date: "2025-03-07",
      sessionDate: "2025-03-05",
      comment: "Good coverage of Python basics, but the session felt a bit rushed. More time on object-oriented concepts would have been helpful.",
      helpful: 3,
    },
  ];

  const renderStars = (rating: number, className = "w-4 h-4") => {
    return (
      <div className="flex gap-1.5 mt-1 text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${className} ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"
            } transition-colors`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (rating >= 3.5) return "text-blue-600 bg-blue-50 border-blue-200";
    if (rating >= 2.5) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const averageRating = (
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
  ).toFixed(1);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[24px] p-8 sm:p-10 text-white shadow-[0_8px_30px_rgb(37,99,235,0.2)] relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">
                Ratings & Feedback
              </h1>
              <p className="text-blue-100/90 text-[17px] font-medium max-w-xl">
                See what students are saying about your tutoring sessions.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-sm flex flex-col items-center justify-center min-w-[140px]">
                <div className="bg-white/20 p-2.5 rounded-xl mb-3">
                  <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                </div>
                <div className="text-2xl font-bold tracking-tight mb-0.5">{averageRating}</div>
                <div className="text-sm font-semibold text-blue-50/80 tracking-wide uppercase">Avg Rating</div>
              </div>
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/30 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 border border-slate-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">Overall Rating</h3>
              <div className="bg-yellow-50 p-2.5 rounded-xl">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
            <div className="text-5xl font-bold text-slate-800 tracking-tight mb-3">{averageRating}</div>
            <div className="text-sm font-medium text-slate-500 mb-2">Based on {feedbacks.length} reviews</div>
            {renderStars(Math.round(parseFloat(averageRating)), "w-5 h-5")}
          </div>

          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 border border-slate-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">Total Reviews</h3>
              <div className="bg-blue-50 p-2.5 rounded-xl">
                <MessageSquareQuote className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="text-5xl font-bold text-slate-800 tracking-tight mb-3">{feedbacks.length}</div>
            <div className="text-sm font-medium text-slate-500">Student feedback received</div>
          </div>

          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 border border-slate-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">Response Rate</h3>
              <div className="bg-emerald-50 p-2.5 rounded-xl">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="text-5xl font-bold text-slate-800 tracking-tight mb-3">87%</div>
            <div className="text-sm font-medium text-slate-500">Students who left feedback</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Rating Distribution */}
          <div className="lg:col-span-1 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100/80 h-fit">
            <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Rating Distribution</h3>
            <div className="space-y-5">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-4 group">
                  <div className="flex items-center gap-1.5 w-12 shrink-0">
                    <span className="text-[15px] font-bold text-slate-700">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-[13px] font-bold text-slate-400 w-10 text-right group-hover:text-slate-600 transition-colors">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Recent Feedback</h3>
            
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-white rounded-[24px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-7 border border-slate-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-100 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                        {feedback.studentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                          {feedback.studentName}
                        </h3>
                        <div className="text-[13px] font-semibold text-slate-500 mt-1 flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md w-fit border border-slate-100">
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                          {feedback.subject}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full font-bold border flex items-center gap-1.5 text-[14px] ${getRatingColor(feedback.rating)}`}>
                      {feedback.rating}.0
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  <div className="text-[15px] text-slate-600 mb-5 leading-relaxed bg-slate-50/50 p-4 rounded-[16px] border border-slate-100/50 italic">
                    "{feedback.comment}"
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-400 font-medium mb-5">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      Session: <span className="text-slate-600 font-semibold">{feedback.sessionDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <Clock className="w-4 h-4" />
                      Reviewed: <span className="text-slate-600 font-semibold">{feedback.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-2 text-[13.5px] font-medium text-slate-500">
                      <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-blue-500">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({feedback.helpful})
                      </button>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-[13.5px] font-semibold bg-blue-500 text-white rounded-[12px] hover:bg-blue-600 active:scale-95 transition-all shadow-sm hover:shadow-md">
                        <MessageCircle className="w-4 h-4" />
                        Reply
                      </button>
                      <button className="flex items-center justify-center gap-2 px-3 py-2 text-[13.5px] font-semibold bg-white text-slate-500 border border-slate-200 rounded-[12px] hover:bg-slate-50 hover:text-slate-700 active:scale-95 transition-all">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
