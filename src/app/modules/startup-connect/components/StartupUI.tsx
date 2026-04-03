"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Building2, Briefcase, ArrowRight } from "lucide-react";

export const StartupUI = ({ onPostGigClick }: { onPostGigClick: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-14 space-y-4">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Startup Connect Portal
          </p>
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tighter text-gray-950 leading-[1.1]">
            <span className="text-green-600">Innovate.</span> <span className="text-orange-600">Connect.</span> <span className="text-blue-700">Thrive.</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-2">
            For the first time in Sri Lanka, startup opportunities that match the talents of campus students and the skilled individuals needed by founders—brought together on a single platform.
          </p>
          <div className="pt-2">
            <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full shadow-sm" />
          </div>
        </div>

        {/* Highlighted Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-3xl mx-auto">
          
          {/* My Company Card */}
          <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] rounded-[2.5rem] transition-all hover:scale-[1.02]">
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-orange-500 to-orange-600" />
            
            <CardHeader className="text-center pt-10 px-6">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-inner">
                <Building2 className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl md:text-xl font-bold text-gray-900">My Company</CardTitle>
              <CardDescription className="pt-2 text-gray-500 text-sm md:text-base px-2">
                Register your startup and connect with skilled students.
              </CardDescription>
              
              <ul className="mt-5 text-left text-[11px] font-bold text-slate-500 space-y-2 inline-block mx-auto">
                <li className="flex items-center gap-2"><span className="text-orange-500 font-bold">•</span> Create your startup profile</li>
                <li className="flex items-center gap-2"><span className="text-orange-500 font-bold">•</span> Post gigs in minutes</li>
                <li className="flex items-center gap-2"><span className="text-orange-500 font-bold">•</span> Invite top matching talent</li>
              </ul>
            </CardHeader>

            <CardContent className="pb-8 pt-4 px-6 space-y-3">
              <Button
                onClick={onPostGigClick}
                className="w-full mx-auto bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm md:text-base py-3 md:py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-100 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </Button>

              <Link href="/startup-connect/dashboard">
                <Button
                  className="w-full max-w-xs mx-auto bg-white text-orange-600 hover:bg-orange-50 font-semibold text-xs md:text-sm py-3 md:py-4 rounded-2xl border border-orange-200 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  Already have an account? Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Browse Gigs Card */}
          <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] rounded-[2.5rem] transition-all hover:scale-[1.02]">
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-600 to-emerald-500" />
            
            <CardHeader className="text-center pt-10 px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                <Briefcase className="w-8 h-8 text-slate-700" />
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">Browse Gigs</CardTitle>
              <CardDescription className="pt-2 text-gray-500 text-sm md:text-base px-2">
                Explore available gigs and discover opportunities that fit your skills.
              </CardDescription>

              <ul className="mt-5 text-left text-[11px] font-bold text-slate-500 space-y-2 inline-block mx-auto">
                <li className="flex items-center gap-2"><span className="text-green-500 font-bold">•</span> Filter by category and level</li>
                <li className="flex items-center gap-2"><span className="text-green-500 font-bold">•</span> View startup details and reviews</li>
                <li className="flex items-center gap-2"><span className="text-green-500 font-bold">•</span> Apply quickly to open gigs</li>
              </ul>
            </CardHeader>

            <CardContent className="pb-8 pt-4 px-6">
              <Link href="/startup-connect/browse-gigs">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95"
                >
                  Explore Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};