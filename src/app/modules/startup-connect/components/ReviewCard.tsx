import React from 'react';
import { Star, Quote, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ReviewCard = ({ review }: any) => {
  return (
    <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
      <Quote className="absolute right-8 top-8 w-16 h-16 text-slate-50 group-hover:text-sky-50/50 transition-colors" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-400 italic">{review.date}</span>
      </div>

      <p className="text-slate-700 font-bold leading-relaxed text-lg mb-8 relative z-10 italic">
        "{review.comment}"
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-700 font-black text-lg">
            {review.user[0]}
          </div>
          <div>
            <p className="font-black text-slate-900 leading-tight">{review.user}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{review.role}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-sky-600 gap-2 font-bold">
          <ThumbsUp className="w-4 h-4" /> Helpful
        </Button>
      </div>
    </div>
  );
};