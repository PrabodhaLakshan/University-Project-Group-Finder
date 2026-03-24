import React from 'react';
import { Star, TrendingUp } from "lucide-react";

export const ReviewStatsCard = ({ stats }: any) => {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 sticky top-28">
      <div className="text-center mb-8">
        <h2 className="text-6xl font-black text-slate-900">{stats.average}</h2>
        <div className="flex justify-center gap-1 my-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < 4 ? "text-orange-500 fill-orange-500" : "text-slate-200"}`} />
          ))}
        </div>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Based on {stats.total} reviews</p>
      </div>

      <div className="space-y-3">
        {stats.breakdown.map((item: any) => (
          <div key={item.stars} className="flex items-center gap-4">
            <span className="text-xs font-black text-slate-500 w-4">{item.stars}</span>
            <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full" 
                style={{ width: `${(item.count / stats.total) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-400 w-6">{item.count}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50">
        <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-2xl">
          <TrendingUp className="w-5 h-5" />
          <p className="text-xs font-bold italic">Top 5% Student Engagement!</p>
        </div>
      </div>
    </div>
  );
};