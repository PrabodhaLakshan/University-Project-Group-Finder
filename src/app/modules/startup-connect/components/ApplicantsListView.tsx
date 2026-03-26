"use client";
import React, { useState } from 'react';
import { Check, X, Eye, MessageCircle, Calendar, MapPin, Star, Github, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Enhanced Mock Data with Gig Details
const GIGS = [
  {
    id: 1,
    title: "Mobile App Development",
    budget: "$5,000 - $8,000",
    timeline: "2-3 months",
    applicants: [
      { id: 1, name: "Kasun Kalhara", date: "2026-02-20", status: "Pending", image: "K", skills: ["React Native", "Firebase", "UI/UX"], experience: "3 years", rating: 4.8, portfolio: "https://portfolio.com" },
      { id: 4, name: "Malinda Perera", date: "2026-01-19", status: "Pending", image: "M", skills: ["Flutter", "Dart", "Backend"], experience: "2 years", rating: 4.6, portfolio: "https://portfolio.com" },
    ]
  },
  {
    id: 2,
    title: "Logo Design",
    budget: "$500 - $1,500",
    timeline: "1-2 weeks",
    applicants: [
      { id: 2, name: "Ishara Madushani", date: "2026-02-18", status: "Reviewed", image: "I", skills: ["Adobe XD", "Figma", "Branding"], experience: "5 years", rating: 4.9, portfolio: "https://portfolio.com" },
      { id: 5, name: "Ravi Jayasekara", date: "2026-03-01", status: "Pending", image: "R", skills: ["Illustrator", "Photoshop", "3D Design"], experience: "4 years", rating: 4.7, portfolio: "https://portfolio.com" },
    ]
  },
  {
    id: 3,
    title: "Backend API Setup",
    budget: "$2,000 - $4,000",
    timeline: "3-4 weeks",
    applicants: [
      { id: 3, name: "Tharindu Ruwan", date: "2026-03-15", status: "Pending", image: "T", skills: ["Node.js", "MongoDB", "RESTful API"], experience: "4 years", rating: 4.8, portfolio: "https://portfolio.com" },
    ]
  },
];

export const ApplicantsListView = () => {
  const [expandedGig, setExpandedGig] = useState<number | null>(1);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Reviewed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Accepted":
        return "bg-green-50 text-green-700 border-green-100";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-black  tracking-tighter text-slate-900">
          Manage <span className="text-blue-600">Applications</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Review and manage applicants for each gig</p>
      </div>

      {GIGS.map((gig) => (
        <Card key={gig.id} className="border border-slate-100 rounded-[28px] overflow-hidden bg-white shadow-sm">
          {/* Gig Header */}
          <button
            onClick={() => setExpandedGig(expandedGig === gig.id ? null : gig.id)}
            className="w-full p-6 md:p-8 bg-linear-to-r from-blue-50 to-slate-50 hover:from-blue-100 hover:to-slate-100 transition-colors text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                  {gig.title}
                </h3>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Briefcase size={16} className="text-blue-600" />
                    Budget: <span className="text-blue-600 font-black">{gig.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Calendar size={16} className="text-orange-600" />
                    Timeline: <span className="text-orange-600 font-black">{gig.timeline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <span className="inline-block px-3 py-1 bg-white border border-slate-100 rounded-lg text-blue-600 font-black">
                      {gig.applicants.length} {gig.applicants.length === 1 ? 'Applicant' : 'Applicants'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-slate-400 text-2xl">
                {expandedGig === gig.id ? '▼' : '▶'}
              </div>
            </div>
          </button>

          {/* Applicants List */}
          {expandedGig === gig.id && (
            <div className="border-t border-slate-100 p-6 md:p-8 bg-white">
              {gig.applicants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 font-bold italic">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {gig.applicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className={`p-5 rounded-3xl border-2 transition-all ${
                        selectedApplicant?.id === applicant.id
                          ? "bg-blue-50 border-blue-200 shadow-md"
                          : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Applicant Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shrink-0">
                            {applicant.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="font-black text-slate-900 text-base uppercase">{applicant.name}</h4>
                              <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${getStatusColor(applicant.status)}`}>
                                {applicant.status}
                              </span>
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Experience</p>
                                <p className="text-sm font-black text-slate-900">{applicant.experience}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-black text-slate-900">{applicant.rating}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Applied on</p>
                                <p className="text-sm font-black text-slate-900">{applicant.date}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                <p className="text-sm font-black text-slate-900">Active</p>
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="mt-3">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {applicant.skills.map((skill) => (
                                  <span key={skill} className="text-[10px] font-bold bg-white border border-blue-100 text-blue-600 px-2.5 py-1 rounded-lg uppercase">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 lg:flex-col xl:flex-row border-t lg:border-t-0 lg:border-l lg:pl-4 pt-4 lg:pt-0">
                          <Button
                            onClick={() => {
                              setSelectedApplicant(applicant);
                              setIsDialogOpen(true);
                            }}
                            className="flex-1 lg:flex-none h-10 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-600 font-black text-[10px] uppercase px-4 flex items-center gap-2"
                          >
                            <Eye size={16} /> View Profile
                          </Button>
                          <Button
                            className="flex-1 lg:flex-none h-10 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 font-black text-[10px] uppercase px-4 flex items-center gap-2"
                          >
                            <Check size={16} /> Accept
                          </Button>
                          <Button
                            className="flex-1 lg:flex-none h-10 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-black text-[10px] uppercase px-4 flex items-center gap-2"
                          >
                            <X size={16} /> Reject
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedApplicant(applicant);
                              setIsMessageDialogOpen(true);
                            }}
                            className="flex-1 lg:flex-none h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[10px] uppercase px-4 flex items-center gap-2"
                          >
                            <MessageCircle size={16} /> Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      ))}

      {/* Applicant Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedApplicant(null);
      }}>
        {selectedApplicant && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg">
                  {selectedApplicant.image}
                </span>
                <span className="text-base font-black uppercase tracking-tight text-slate-900">
                  {selectedApplicant.name}
                </span>
              </DialogTitle>
              <DialogDescription className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Applicant profile overview
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Experience</p>
                  <p className="font-black text-slate-900">{selectedApplicant.experience}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-black text-slate-900">{selectedApplicant.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Applied on</p>
                  <p className="font-black text-slate-900">{selectedApplicant.date}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                  <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-[10px] font-black ${getStatusColor(selectedApplicant.status)}`}>
                    {selectedApplicant.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="text-[10px] font-bold bg-slate-50 border border-blue-100 text-blue-600 px-2.5 py-1 rounded-lg uppercase"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedApplicant.portfolio && (
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Portfolio</p>
                  <a
                    href={selectedApplicant.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline break-all"
                  >
                    {selectedApplicant.portfolio}
                  </a>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Messaging Dialog */}
      <Dialog
        open={isMessageDialogOpen}
        onOpenChange={(open) => {
          setIsMessageDialogOpen(open);
          if (!open) {
            setMessageText("");
          }
        }}
      >
        {selectedApplicant && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-black uppercase tracking-tight text-slate-900">
                Send Message to {selectedApplicant.name}
              </DialogTitle>
              <DialogDescription className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Start a conversation with this applicant
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Message
              </label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="text-sm"
                placeholder="Type your message here..."
              />
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsMessageDialogOpen(false);
                  setMessageText("");
                }}
                className="h-9 rounded-lg text-[11px] font-bold uppercase tracking-widest"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!messageText.trim()}
                className="h-9 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold uppercase tracking-widest"
                onClick={() => {
                  // later integrate API call to send the message
                  setIsMessageDialogOpen(false);
                  setMessageText("");
                  setToastMessage("Message Sent!");
                  setTimeout(() => setToastMessage(""), 2500);
                }}
              >
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Simple Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-green-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};