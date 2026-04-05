"use client";
import React from 'react';
import { Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { sendInviteNotification } from '../services/notification.service';
import { getToken } from '@/lib/auth';

type TopTalent = {
  id: string;
  name: string;
  role: string;
  rating: string;
  match: number;
  skills: string[];
};

export const TalentPoolView = () => {
  const [invitingId, setInvitingId] = React.useState<string | null>(null);
  const [talents, setTalents] = React.useState<TopTalent[]>([]);
  const [matchedCount, setMatchedCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchTalents = async () => {
      try {
        const token = getToken();
        const res = await fetch("/api/startup-connect/dashboard/top-matches?minMatch=98", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) return;
        const json = await res.json();
        const payload = json.data ?? json;
        if (Array.isArray(payload)) setTalents(payload as TopTalent[]);
        if (json?.meta?.matchedCount != null && typeof json.meta.matchedCount === "number") {
          setMatchedCount(json.meta.matchedCount);
        }
      } catch (err) {
        console.error("Failed to load top talents", err);
      }
    };
    fetchTalents();
  }, []);

  const handleInvite = async (student: TopTalent) => {
    try {
      setInvitingId(student.id);
      await sendInviteNotification({
        receiverId: student.id,
        studentName: student.name,
        gigTitle: "Campus Collaboration Gig",
      });
    } catch {
      // Keep UX clean: avoid popup alerts; just log for debugging.
      console.error("Failed to send invitation");
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/90 via-white to-emerald-50/35 p-8 max-w-7xl mx-auto mt-20">
      <div className="flex flex-col mb-10">
        <div className="h-1.5 w-14 bg-gradient-to-r from-blue-600 via-orange-500 to-emerald-500 rounded-full mb-4 shadow-sm shadow-orange-200/50" />
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
          Top <span className="text-orange-500">Talent</span>{" "}
          <span className="text-blue-700">Pool</span>
        </h1>
        <p className="text-slate-600 font-bold mt-1">
          Invite the best campus minds to your next big gig
        </p>
        <p className="mt-3 inline-flex w-fit items-center rounded-full border border-sky-200/80 bg-gradient-to-r from-sky-50 to-emerald-50/70 px-4 py-1.5 text-[12px] font-bold text-slate-600 shadow-sm ring-1 ring-sky-100/60">
          <span className="mr-2 text-[10px] font-black uppercase tracking-widest text-blue-700">
            98%+ matches
          </span>
          <span className="font-black text-emerald-700">{matchedCount}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {talents.map((student) => {
          const circumference = 2 * Math.PI * 20;
          const strokeDashoffset = circumference - (student.match / 100) * circumference;
          const color =
            student.match >= 99
              ? "bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-300/40"
              : student.match >= 98
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-300/40"
                : "bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-300/40";

          return (
          <Card
            key={student.id}
            className="relative p-6 border border-sky-200/60 bg-gradient-to-br from-white via-sky-50/40 to-orange-50/25 rounded-[40px] shadow-[0_18px_50px_-12px_rgba(59,130,246,0.2)] ring-1 ring-sky-100/50 hover:-translate-y-2 hover:shadow-[0_24px_60px_-10px_rgba(16,185,129,0.22)] hover:ring-blue-200/40 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase leading-none">{student.name}</h3>
                <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-widest bg-blue-50/80 px-2 py-0.5 rounded-full w-fit">
                  {student.role}
                </p>
              </div>
            </div>

              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke={student.match >= 95 ? "#10b981" : student.match >= 90 ? "#3b82f6" : "#f59e0b"}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">
                  {student.match}%
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {student.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gradient-to-r from-sky-50 to-emerald-50/80 border border-sky-100/80 text-[9px] font-black rounded-full text-slate-700 uppercase shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-sky-100/80">
              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50/90 px-2 py-1 text-amber-600 font-black text-sm ring-1 ring-amber-200/60">
                <Star size={16} fill="currentColor" className="text-amber-500" /> {student.rating}
              </div>
              {/* Invite Button */}
              <Button 
                type="button"
                onClick={() => handleInvite(student)}
                disabled={invitingId === student.id}
                className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 hover:from-blue-700 hover:via-sky-700 hover:to-emerald-700 text-white rounded-2xl px-6 py-5 font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_10px_28px_-6px_rgba(37,99,235,0.45)] disabled:opacity-70"
              >
                <Zap className="w-3 h-3 mr-2" /> {invitingId === student.id ? "SENDING..." : "INVITE TO GIG"}
              </Button>
            </div>
          </Card>
        )})}
      </div>
      {talents.length === 0 && (
        <div className="mt-8 rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-50/50 via-white to-sky-50/50 px-6 py-10 text-center shadow-[0_14px_45px_-12px_rgba(234,88,12,0.15)] ring-1 ring-orange-100/50">
          <p className="text-sm font-black text-slate-800 uppercase tracking-widest">
            No 98%+ matches yet
          </p>
          <p className="text-xs font-bold text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
            Post gigs with clear required skills to get stronger student matches.
          </p>
        </div>
      )}
    </div>
  );
};