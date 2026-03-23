"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Building2, Briefcase, ArrowRight } from "lucide-react";

export const StartupUI = ({ onPostGigClick }: { onPostGigClick: () => void }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 md:px-8 py-12 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-14 md:mb-16 space-y-4 md:space-y-5">
          <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Startup Connect Portal
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-950 leading-tight">
            <span className="text-green-600">Innovate.</span> <span className="text-orange-600">Connect.</span> <span className="text-blue-700">Thrive.</span>
          </h1>
          <p className="text-slate-600 text-base md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            For the first time in Sri Lanka, startup opportunities that match the talents of campus students and the skilled individuals needed by founders—brought together on a single platform.
          </p>
          <div className="pt-3 md:pt-4">
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            Choose how you want to start below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          <Card className="group relative overflow-hidden border border-gray-100 shadow-xl shadow-gray-50/50 hover:border-orange-200 hover:shadow-orange-50 transition-all duration-300 rounded-3xl">
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-orange-500 to-orange-700" />
            <CardHeader className="text-center pt-10 md:pt-12 px-6">
              <div className="w-20 h-20 bg-orange-100/70 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                <Building2 className="w-10 h-10 text-orange-700" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-950">My Company</CardTitle>
              <CardDescription className="pt-3 text-gray-600 text-base">
                Register your startup and connect with skilled students.
              </CardDescription>
              <ul className="mt-4 text-left text-[11px] font-bold text-slate-500 space-y-1.5">
                <li>• Create your startup profile</li>
                <li>• Post gigs in minutes</li>
                <li>• Invite top matching talent</li>
              </ul>
            </CardHeader>
            <CardContent className="pb-10 pt-4 px-6">
              <Button
                onClick={onPostGigClick}
                aria-label="Create startup company account"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 rounded-xl group flex items-center justify-center gap-2 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-300"
              >
                Create Company Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border border-gray-100 shadow-xl shadow-gray-50/50 hover:border-gray-200 hover:shadow-gray-100 transition-all duration-300 rounded-3xl">
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-600 to-orange-500" />
            <CardHeader className="text-center pt-10 md:pt-12 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-10 h-10 text-gray-700" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-950">Browse Gigs</CardTitle>
              <CardDescription className="pt-3 text-gray-600 text-base">
                Explore available gigs and discover opportunities that fit your skills.
              </CardDescription>
              <ul className="mt-4 text-left text-[11px] font-bold text-slate-500 space-y-1.5">
                <li>• Filter by category and level</li>
                <li>• View startup details and reviews</li>
                <li>• Apply quickly to open gigs</li>
              </ul>
            </CardHeader>
            <CardContent className="pb-10 pt-4 px-6">
              <Link href="/startup-connect/browse-gigs">
                <Button
                  aria-label="Browse available gigs"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-xl group flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-green-300"
                >
                  Explore Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};