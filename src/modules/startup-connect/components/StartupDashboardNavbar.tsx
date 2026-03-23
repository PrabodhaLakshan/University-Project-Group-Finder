"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, MessageSquare, PlusCircle, Bell, User } from "lucide-react";

export const StartupDashboardNavbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/startup-connect" className="text-2xl font-black italic tracking-tighter">
            UNI<span className="text-blue-700">NEXUS</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/startup-connect" className="text-blue-700 flex items-center gap-2"><LayoutDashboard size={16}/> Dashboard</Link>
            <Link href="#" className="hover:text-orange-600 transition-colors flex items-center gap-2"><PlusCircle size={16}/> Post Gig</Link>
            <Link href="#" className="hover:text-orange-600 transition-colors flex items-center gap-2"><Users size={16}/> Talent Pool</Link>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gray-400">
          <Bell size={20} className="cursor-pointer hover:text-orange-600 transition-colors" />
          <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm cursor-pointer">
            <User size={20} className="text-orange-600" />
          </div>
        </div>
      </div>
    </nav>
  );
};