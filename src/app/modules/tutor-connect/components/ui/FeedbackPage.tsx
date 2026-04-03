"use client";

import React, { useState } from "react";
import { 
  Star, MessageSquareQuote, BarChart3, BookOpen, Calendar, Clock, 
  ThumbsUp, MessageCircle, AlertCircle, ChevronLeft, ChevronRight,
  TrendingUp, ShieldCheck, Users, Activity
} from "lucide-react";

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
    { id: 1, studentName: "Sahan Kavindu", subject: "Database Systems", rating: 5, date: "2025-03-08", sessionDate: "2025-03-10", comment: "Excellent tutor! Explained complex SQL concepts in a very clear and understandable way. The examples were practical and helped me grasp database design principles quickly.", helpful: 12 },
    { id: 2, studentName: "Dinuki Hansika", subject: "Data Structures", rating: 4, date: "2025-03-09", sessionDate: "2025-03-12", comment: "Great session on linked lists and trees. The visual diagrams were very helpful. Would have liked more practice problems, but overall very satisfied.", helpful: 8 },
    { id: 3, studentName: "Ashen Lakmal", subject: "Web Development", rating: 5, date: "2025-03-08", sessionDate: "2025-03-08", comment: "Amazing tutor! Made React hooks so easy to understand. The hands-on approach and real-time coding examples were exactly what I needed. Highly recommend!", helpful: 15 },
    { id: 4, studentName: "Pabasara Dilshan", subject: "Algorithm Design", rating: 4, date: "2025-03-10", sessionDate: "2025-03-15", comment: "Very knowledgeable about algorithms. The dynamic programming explanation was thorough. Sometimes goes a bit fast, but always willing to slow down and clarify.", helpful: 6 },
    { id: 5, studentName: "Hasini Madubhashini", subject: "Machine Learning", rating: 5, date: "2025-03-05", sessionDate: "2025-03-03", comment: "Outstanding teaching style! Breaks down complex ML concepts into simple, digestible parts. The practical examples with real datasets were incredibly valuable.", helpful: 18 },
    { id: 6, studentName: "Thilina Sandaruwan", subject: "Python Programming", rating: 3, date: "2025-03-07", sessionDate: "2025-03-05", comment: "Good coverage of Python basics, but the session felt a bit rushed. More time on object-oriented concepts would have been helpful.", helpful: 3 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(feedbacks.length / cardsPerPage);

  const averageRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col pt-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header - Blue Theme */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[24px] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3">Ratings & Feedback</h1>
              <p className="text-blue-100/90 text-[17px] font-medium max-w-xl">Monitor your teaching performance and student satisfaction levels.</p>
            </div>
            <div className="hidden md:flex bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex-col items-center min-w-[140px]">
              <div className="bg-white/20 p-2.5 rounded-xl mb-3">
                <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
              </div>
              <div className="text-2xl font-bold">{averageRating}</div>
              <div className="text-xs font-semibold uppercase opacity-80">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Stats Grid - All Blue/Slate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Overall Rating", value: averageRating, sub: `Based on ${feedbacks.length} reviews`, icon: Star, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Total Reviews", value: feedbacks.length, sub: "Student feedback received", icon: MessageSquareQuote, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Response Rate", value: "87%", sub: "Students who left feedback", icon: BarChart3, color: "text-blue-700", bg: "bg-blue-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</h3>
                <div className={`${stat.bg} p-2.5 rounded-xl`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
              </div>
              <div className="text-4xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Rating Distribution */}
            <div className="bg-white rounded-[24px] shadow-sm p-8 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Rating Distribution</h3>
              <div className="space-y-4">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-8 shrink-0">
                      <span className="text-sm font-bold text-slate-600">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Insights Card */}
            <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-5 text-blue-600 font-bold text-sm uppercase tracking-wide">
                <TrendingUp className="w-4 h-4" />
                Teaching Insights
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-500">
                    <span>Web Development</span>
                    <span className="text-blue-600">98% Success</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[98%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-500">
                    <span>Database Systems</span>
                    <span className="text-blue-500">92% Success</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Student Trust Card */}
            <div className="bg-blue-600 rounded-[24px] p-7 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-200" />
                  <h3 className="font-bold text-lg">Student Trust</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                    <Users className="w-4 h-4 mb-1 opacity-70" />
                    <div className="text-xl font-bold">45+</div>
                    <div className="text-[10px] uppercase font-bold opacity-60 text-blue-100">Repeat Students</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                    <Activity className="w-4 h-4 mb-1 opacity-70" />
                    <div className="text-xl font-bold">12m</div>
                    <div className="text-[10px] uppercase font-bold opacity-60 text-blue-100">Avg Response</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>

          {/* Feedback List Section */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Recent Feedback</h3>
            
            <div className="space-y-4">
              {currentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-[24px] p-7 border border-slate-100 hover:border-blue-200 shadow-sm transition-all group">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
                        {feedback.studentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{feedback.studentName}</h3>
                        <div className="text-xs font-bold text-blue-600 flex items-center gap-1.5 mt-0.5 bg-blue-50/50 px-2 py-0.5 rounded-md w-fit">
                          <BookOpen className="w-3.5 h-3.5" /> {feedback.subject}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full font-bold border border-blue-100 bg-blue-50 text-blue-700 flex items-center gap-1.5 text-xs">
                      {feedback.rating}.0 <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>

                  <p className="text-[15px] text-slate-600 mb-6 leading-relaxed bg-slate-50/80 p-5 rounded-2xl italic border border-slate-100">
                    "{feedback.comment}"
                  </p>

                  <div className="flex flex-wrap gap-5 text-xs text-slate-400 font-bold mb-6 border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-lg"><Calendar className="w-4 h-4 text-blue-500" /> Session: <span className="text-slate-700">{feedback.sessionDate}</span></div>
                    <div className="flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4 text-blue-500" /> Reviewed: <span className="text-slate-700">{feedback.date}</span></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                      <ThumbsUp className="w-4 h-4" /> Helpful ({feedback.helpful})
                    </button>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                        <MessageCircle className="w-4 h-4" /> Reply
                      </button>
                      <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-all shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button key={num} onClick={() => setCurrentPage(num)} className={`w-11 h-11 rounded-xl font-bold transition-all ${currentPage === num ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400"}`}>{num}</button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50 transition-all shadow-sm"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}