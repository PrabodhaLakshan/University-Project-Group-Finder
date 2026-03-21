"use client";
import React from 'react';
import { Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { sendInviteNotification } from '../services/notification.service';

//  (Mock Data)
const TOP_TALENTS = [
  { id: 1, receiverId: "student-1", name: "Nimal Siriwardana", role: "Fullstack Developer", rating: 4.9, match: 92, skills: ["React", "Node.js", "AWS"], color: "bg-blue-500" },
  { id: 2, receiverId: "student-2", name: "Sanduni Perera", role: "UI/UX Designer", rating: 5.0, match: 91, skills: ["Figma", "Branding"], color: "bg-purple-500" },
  { id: 3, receiverId: "student-3", name: "Kaveen de Silva", role: "Mobile App Dev", rating: 4.8, match: 89, skills: ["Flutter", "Firebase"], color: "bg-emerald-500" },
];

export const TalentPoolView = () => {
  const [invitingId, setInvitingId] = React.useState<number | null>(null);

  const handleInvite = async (student: (typeof TOP_TALENTS)[number]) => {
    try {
      setInvitingId(student.id);
      await sendInviteNotification({
        receiverId: student.receiverId,
        studentName: student.name,
        gigTitle: "Campus Collaboration Gig",
      });
      alert(`Invitation sent to ${student.name}! ✉️`);
    } catch {
      alert("Failed to send invitation. Please try again.");
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto mt-20">
      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-black italic text-slate-900 tracking-tighter uppercase">
          Top <span className="text-orange-500">Talent</span> Pool
        </h1>
        <p className="text-slate-500 font-bold italic">Invite the best campus minds to your next big gig</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TOP_TALENTS.map((student) => {
          const circumference = 2 * Math.PI * 20;
          const strokeDashoffset = circumference - (student.match / 100) * circumference;

          return (
          <Card key={student.id} className="p-6 border-none bg-white rounded-[40px] shadow-2xl shadow-slate-100 hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${student.color} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black italic text-slate-900 uppercase leading-none">{student.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{student.role}</p>
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
                <span key={skill} className="px-3 py-1 bg-slate-100 text-[9px] font-black rounded-full text-slate-600 uppercase">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-1 text-yellow-500 font-black text-sm">
                <Star size={16} fill="currentColor" /> {student.rating}
              </div>
              {/* Invite Button */}
              <Button 
                type="button"
                onClick={() => handleInvite(student)}
                disabled={invitingId === student.id}
                className="bg-orange-600 hover:bg-slate-900 text-white rounded-2xl px-6 py-5 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-orange-100"
              >
                <Zap className="w-3 h-3 mr-2" /> {invitingId === student.id ? "SENDING..." : "INVITE TO GIG"}
              </Button>
            </div>
          </Card>
        )})}
      </div>
    </div>
  );
};