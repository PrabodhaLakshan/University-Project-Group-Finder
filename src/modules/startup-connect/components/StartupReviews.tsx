"use client";
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { AddReviewModal } from './AddReviewModal';

const REVIEWS = [
  {
    id: 1,
    studentName: "Amara Perera",
    role: "Backend Developer",
    comment: "Great experience working with this startup. The team is very supportive and the project was challenging but rewarding.",
    rating: 5,
    date: "2 months ago"
  },
  {
    id: 2,
    studentName: "Sahan Gunawardena",
    role: "UI Designer",
    comment: "Clear communication and timely payments. Highly recommend for any student looking for real-world experience.",
    rating: 4,
    date: "5 months ago"
  }
];

export const StartupReviews = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [reviews, setReviews] = React.useState(REVIEWS);

  const handleAddReview = (review: {
    studentName: string;
    role: string;
    comment: string;
    rating: number;
  }) => {
    setReviews((prev) => [
      {
        id: prev.length + 1,
        studentName: review.studentName,
        role: review.role,
        comment: review.comment,
        rating: review.rating,
        date: "Just now",
      },
      ...prev,
    ]);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-16 bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-50">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
            Startup <span className="text-orange-500">Reviews</span>
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">What students say about working here</p>
        </div>
        
        {/* Overall Rating Badge */}
        <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
            <span className="text-2xl font-black text-orange-600">{averageRating}</span>
            <div className="flex flex-col">
                <div className="flex text-orange-400"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                <span className="text-[9px] font-black text-slate-400 uppercase">{reviews.length} Reviews</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-8 bg-slate-50/50 rounded-[32px] border border-transparent hover:border-orange-200 transition-all group relative">
            <Quote className="absolute top-6 right-6 text-slate-200 group-hover:text-orange-100 transition-colors" size={40} />
            
            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={14} className="text-orange-500 fill-orange-500" />
              ))}
            </div>

            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 italic">
              "{review.comment}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100 text-xs">
                  {review.studentName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">{review.studentName}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{review.role}</p>
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-300 uppercase">{review.date}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-10 w-full py-6 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-400 font-black text-[10px] uppercase hover:bg-slate-50 hover:border-orange-300 hover:text-orange-500 transition-all group"
      >
        <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
          + Share your experience with this startup
        </span>
      </button>

      {isModalOpen && (
        <AddReviewModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
};