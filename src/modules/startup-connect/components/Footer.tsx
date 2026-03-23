import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">
             <span className="text-[10px] font-bold text-slate-500">UN</span>
           </div>
           <p className="text-sm font-bold text-slate-400">
             © 2024 <span className="text-slate-900">UNINEXUS Sri Lanka.</span> All rights reserved.
           </p>
        </div>
        
        <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
           <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
           <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};