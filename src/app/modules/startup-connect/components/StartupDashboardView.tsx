"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Zap, Briefcase, ArrowUpRight, Github, ExternalLink, ShieldCheck, Rocket, Settings, Pen, Trash2, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { PostGigModal, type GigFormValues } from "./PostGigModal";
import { AddProjectModal } from "./AddProjectModal";
import { DashboardLayout } from "./DashboardLayout";
import { StartupProfile } from "../context/StartupProfileContext";

type TalentItem = {
  name: string;
  role: string;
  match: string;
  skills: string[];
};

type RecentWorkItem = {
  id: number;
  title: string;
  description: string;
  github?: string;
  demo?: string;
  date: string;
  images: string[];
};

type Gig = {
  id: number;
  title: string;
  budget: string;
  deadline: string;
  description: string;
  skills: string[];
};

const TALENT_ITEMS: TalentItem[] = [
  { name: "Pasindu Perera", role: "Full-Stack Dev", match: "98%", skills: ["React", "Node.js"] },
  { name: "Ishani Silva", role: "UI/UX Designer", match: "95%", skills: ["Figma", "Tailwind"] },
  { name: "Kavindu Gunawardena", role: "App Developer", match: "95%", skills: ["Flutter", "Firebase"] },
];

const INITIAL_RECENT_WORKS: RecentWorkItem[] = [
  {
    id: 1,
    title: "Campus Event Hub",
    description: "Platform for student club event listings, registrations, and reminders.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Mar 2026",
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070"],
  },
  {
    id: 2,
    title: "Startup Talent Matcher",
    description: "AI-assisted matching engine that connects startups with the best campus talent.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Feb 2026",
    images: ["https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070"],
  },
  {
    id: 3,
    title: "Founder CRM Lite",
    description: "Lightweight CRM to track founder–student conversations and gig pipelines.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Jan 2026",
    images: ["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"],
  },
  {
    id: 4,
    title: "Uni Payments Microservice",
    description: "Secure microservice for handling milestone-based gig payouts.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Dec 2025",
    images: ["https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2070"],
  },
  {
    id: 5,
    title: "Insight Analytics Dashboard",
    description: "Real-time dashboard showing gig performance and student engagement.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Nov 2025",
    images: ["https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070"],
  },
  {
    id: 6,
    title: "Mentor Booking Portal",
    description: "Scheduling tool for booking mentoring sessions between founders and students.",
    github: "https://github.com",
    demo: "https://example.com",
    date: "Oct 2025",
    images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070"],
  },
  
];

const CERTIFICATE_IMAGE_SOURCES = [
  "/certificate-registration.jpg",
  "/certificate-registration.jpeg",
  "/certificate-registration.png",
  "/certificate-registration.webp",
];

export const StartupDashboardView = ({ data }: { data: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isManagingGigs, setIsManagingGigs] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [certificateImageFailed, setCertificateImageFailed] = useState(false);
  const [certificateSrcIndex, setCertificateSrcIndex] = useState(0);
  const [certificatePreviewUrl, setCertificatePreviewUrl] = useState<string | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [selectedGigForEdit, setSelectedGigForEdit] = useState<Gig | null>(null);
  
  const [startupProfile, setStartupProfile] = useState<StartupProfile>({
    name: data?.name || "Startup",
    industry: data?.industry || "Technology",
    about: data?.about || "",
    logo: data?.logo ?? null,
    certificates: Array.isArray(data?.certificates) ? data.certificates : [],
  });

  const [editForm, setEditForm] = useState<StartupProfile>(startupProfile);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [recentWorks, setRecentWorks] = useState<RecentWorkItem[]>(INITIAL_RECENT_WORKS);

  const handleContactTalent = (talentName: string) => {
    setNotificationMessage(`Notification sent to ${talentName} successfully!`);
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  useEffect(() => {
    const nextData = {
      name: data?.name || "Startup",
      industry: data?.industry || "Technology",
      about: data?.about || "",
      logo: data?.logo ?? null,
      certificates: Array.isArray(data?.certificates) ? data.certificates : [],
    };
    setStartupProfile(nextData);
    setEditForm(nextData);
  }, [data]);

  useEffect(() => {
    if (!startupProfile.logo) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(startupProfile.logo);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [startupProfile.logo]);

  useEffect(() => {
    const files = Array.isArray(startupProfile.certificates) ? startupProfile.certificates : [];

    let objectUrl: string | null = null;

    if (files.length > 0) {
      const first = files[0];

      if (first instanceof File && first.type && first.type.startsWith("image/")) {
        objectUrl = URL.createObjectURL(first);
        setCertificatePreviewUrl(objectUrl);
        setCertificateImageFailed(false);
        setCertificateSrcIndex(0);
      } else {
        setCertificatePreviewUrl(null);
      }
    } else {
      setCertificatePreviewUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [startupProfile.certificates]);

  const handleSaveProfile = () => {
    setStartupProfile(editForm);
    setIsManageOpen(false);
  };

  const handleCancelManage = () => {
    setEditForm(startupProfile);
    setIsManageOpen(false);
  };

  const handleEditLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setEditForm((prev) => ({ ...prev, logo: file }));
  };

  const handleEditCertificatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setEditForm((prev) => ({ ...prev, certificates: files }));
  };

  const handleAddRecentWork = (newWork: RecentWorkItem) => {
    setRecentWorks((prev) => [newWork, ...prev]);
  };

  const handleSaveGig = (gig: GigFormValues) => {
    setGigs((prev) => {
      if (gig.id != null) {
        return prev.map((existing) =>
          existing.id === gig.id
            ? {
                id: gig.id!,
                title: gig.title,
                budget: gig.budget,
                deadline: gig.deadline,
                description: gig.description,
                skills: gig.skills,
              }
            : existing
        );
      }

      const nextId = prev.length ? Math.max(...prev.map((g) => g.id)) + 1 : 1;
      return [
        {
          id: nextId,
          title: gig.title,
          budget: gig.budget,
          deadline: gig.deadline,
          description: gig.description,
          skills: gig.skills,
        },
        ...prev,
      ];
    });
  };

  const handleDeleteGig = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this gig?");
    if (!confirmed) return;
    setGigs((prev) => prev.filter((gig) => gig.id !== id));
  };

  const certificates = Array.isArray(startupProfile.certificates) ? startupProfile.certificates : [];
  const displayName = startupProfile.name || "Startup";
  const displayIndustry = startupProfile.industry || "Technology";

  return (
    <DashboardLayout contentClassName="space-y-10 bg-[#f8fafc]/50">
      <PostGigModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGigForEdit(null);
        }}
        initialGig={selectedGigForEdit ?? undefined}
        onSubmitGig={handleSaveGig}
      />

      <div className="max-w-7xl mx-auto space-y-10 px-4">
        {isManagingGigs ? (
          <>
            {/* --- MANAGE GIGS VIEW --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
              <div>
                <div className="h-1.5 w-12 bg-blue-700 rounded-full mb-3" />
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                  Manage <span className="text-orange-600">My Gigs</span>
                </h2>
                <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.25em]">
                  Update or remove opportunities you have posted
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-1xl font-black text-[10px] uppercase tracking-widest px-5 py-3 border-slate-200 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                  onClick={() => {
                    setIsManagingGigs(false);
                  }}
                >
                  ← Back to Dashboard
                </Button>
                
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {gigs.length === 0 ? (
                <Card className="p-8 rounded-[32px] bg-white border border-dashed border-slate-200 text-center">
                  <p className="text-sm font-black text-slate-700 uppercase tracking-[0.25em]">
                    No gigs yet
                  </p>
                  <p className="text-xs font-bold text-slate-400 mt-2">
                    Use "Post Gig" to create your first opportunity.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {gigs.map((gig) => (
                    <Card
                      key={gig.id}
                      className="p-6 rounded-[28px] border border-slate-100 bg-white shadow-md flex flex-col gap-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">
                            Active Gig
                          </p>
                          <h3 className="text-base md:text-lg font-black text-slate-900 leading-tight line-clamp-2">
                            {gig.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGigForEdit(gig);
                              setIsModalOpen(true);
                            }}
                            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                            aria-label="Edit gig"
                          >
                            <Pen size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGig(gig.id)}
                            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                            aria-label="Delete gig"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-slate-500 line-clamp-3">
                        {gig.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 mt-2">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-blue-700" />
                          <span>{gig.budget}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} className="text-orange-500" />
                          <span>{gig.deadline}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>

        {/* --- WELCOME HEADER SECTION --- */}
        <Card className="relative overflow-hidden p-8 md:p-12 border-none rounded-[40px] bg-white shadow-2xl shadow-blue-100/20">
          {/* Decorative Background Blobs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-28 h-28 rounded-[32px] overflow-hidden border-[6px] border-white bg-white shadow-2xl shadow-blue-200/50 flex items-center justify-center text-4xl font-black text-blue-700 transition-transform group-hover:scale-105 duration-300">
                  {logoPreviewUrl ? (
                    <img src={logoPreviewUrl} alt="Business logo" className="w-full h-full object-cover" />
                  ) : (
                    displayName.charAt(0)
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                    <ShieldCheck size={18} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Verified Startup</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
                  Hi, <span className="text-blue-700">{displayName}</span>
                </h1>
                <p className="text-slate-400 font-bold text-sm mt-2 flex items-center gap-2">
                    <Rocket size={16} className="text-orange-500" /> {displayIndustry} Innovation Sector
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedGigForEdit(null);
                  setIsModalOpen(true);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl shadow-orange-200 flex items-center gap-3 transition-all active:scale-95 group"
              >
                <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> POST A NEW GIG
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditForm(startupProfile);
                  setIsManageOpen(true);
                }}
                className="w-10 h-10 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                aria-label="Manage dashboard settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </Card>

        {/* --- EDIT PROFILE (MANAGE) SECTION --- */}
        {isManageOpen && (
          <Card className="p-8 border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-[35px] animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-blue-700 rounded-full" />
                <h3 className="text-lg font-black uppercase text-slate-800 tracking-tight">Refine Your Identity</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-blue-700 ml-1 tracking-widest">Startup Name</label>
                <Input
                  value={editForm.name}
                  className="rounded-2xl border-none shadow-sm bg-white h-14 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-blue-700 ml-1 tracking-widest">Industry Type</label>
                <Input
                  value={editForm.industry}
                  className="rounded-2xl border-none shadow-sm bg-white h-14 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => setEditForm((prev) => ({ ...prev, industry: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <label className="text-[11px] font-black uppercase text-blue-700 ml-1 tracking-widest">Mission & Vision</label>
              <Textarea
                value={editForm.about}
                placeholder="Describe your startup's core mission..."
                className="rounded-2xl border-none shadow-sm bg-white font-bold min-h-32 p-5 text-slate-700 focus:ring-2 focus:ring-blue-500"
                onChange={(event) => setEditForm((prev) => ({ ...prev, about: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-blue-700 ml-1 tracking-widest">Update Logo</label>
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                    <Input type="file" accept="image/*" className="border-none bg-transparent font-bold cursor-pointer" onChange={handleEditLogoChange} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase text-blue-700 ml-1 tracking-widest">Registration Docs</label>
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                    <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp" className="border-none bg-transparent font-bold cursor-pointer" onChange={handleEditCertificatesChange} />
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-10">
              <Button variant="ghost" onClick={handleCancelManage} className="rounded-2xl font-black text-xs uppercase px-8 py-6 hover:bg-red-50 hover:text-red-500 transition-colors">
                Discard
              </Button>
              <Button onClick={handleSaveProfile} className="bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-xs uppercase px-8 py-6 shadow-xl shadow-blue-200">
                Update Profile
              </Button>
            </div>
          </Card>
        )}

        {/* --- STATS OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Active Gigs"
            value={String(gigs.length).padStart(2, "0")}
            tone="blue"
            icon={<Briefcase size={22} />}
            onClick={() => setIsManagingGigs(true)}
          />
          <StatCard label="New Applicants" value="28" tone="orange" icon={<Users size={22} />} />
          <StatCard label="Talent Reach" value="1.2k" tone="green" icon={<Zap size={22} />} />
        </div>

        {/* --- VISION & ASSETS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="p-10 border-none rounded-[35px] bg-white shadow-xl shadow-slate-200/50 lg:col-span-7 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700" />
            <h3 className="text-[11px] font-black uppercase text-blue-700 tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-700" /></span>
                Company Vision
            </h3>
            <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed">
              "{startupProfile.about || "Empowering the next generation of campus innovators through meaningful opportunities."}"
            </p>
          </Card>

          <Card className="p-8 border-none rounded-[35px] bg-white shadow-xl shadow-slate-200/50 lg:col-span-5">
            <h3 className="text-[11px] font-black uppercase text-orange-600 tracking-[0.3em] mb-6">Verification Assets</h3>
            <div className="space-y-6">
              <div className="group relative rounded-3xl overflow-hidden bg-slate-50 border-2 border-slate-100 p-3 hover:border-orange-200 transition-colors">
                <div className="h-40 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                  {certificatePreviewUrl ? (
                    <img
                      src={certificatePreviewUrl}
                      alt="Uploaded certificate"
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : certificateImageFailed ? (
                    <div className="flex flex-col items-center gap-2 opacity-40">
                        <Briefcase size={40} />
                        <span className="text-[10px] font-black">DOCUMENT_PENDING</span>
                    </div>
                  ) : (
                    <img
                      src={CERTIFICATE_IMAGE_SOURCES[certificateSrcIndex]}
                      alt="Certificate"
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      onError={() => {
                        if (certificateSrcIndex < CERTIFICATE_IMAGE_SOURCES.length - 1) {
                          setCertificateSrcIndex((prev) => prev + 1);
                        } else {
                          setCertificateImageFailed(true);
                        }
                      }}
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registration Cert</p>
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"><ShieldCheck size={12} className="text-white" /></div>
                </div>
              </div>

              {certificates.length > 0 && (
                <div className="space-y-2">
                  {certificates.map((file: File, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-blue-400" /> {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* --- RECENT WORKS SECTION --- */}
        <div id="portfolio" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <div className="h-1.5 w-12 bg-orange-500 rounded-full mb-3" />
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                    Startup <span className="text-blue-700">Portfolio</span>
                </h2>
                <p className="text-slate-400 font-bold text-sm mt-2">Displaying your recent milestones and projects</p>
            </div>
            <AddProjectModal onAddProject={handleAddRecentWork} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {recentWorks.map((work) => (
              <Card key={work.id} className="group overflow-hidden rounded-[24px] border-none bg-white shadow-md shadow-slate-200/60 hover:shadow-xl hover:shadow-blue-200/40 transition-all duration-300 border-b-4 border-blue-700">
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <img src={work.images[0]} alt={work.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-blue-700 shadow-sm uppercase">{work.date}</div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight line-clamp-2">{work.title}</h3>
                  <p className="text-slate-500 font-bold text-xs mt-2 leading-relaxed line-clamp-3">{work.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1 rounded-2xl border-slate-200 font-black text-[9px] uppercase h-9 hover:bg-slate-50" onClick={() => work.github && window.open(work.github, "_blank")}>
                      <Github size={16} className="mr-2" /> Repository
                    </Button>
                    <Button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-[9px] uppercase h-9 shadow-md shadow-blue-100" onClick={() => work.demo && window.open(work.demo, "_blank")}>
                      View Project <ExternalLink size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* --- TALENT SUGGESTIONS --- */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700">
                    <Users size={24} strokeWidth={3} />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                        Top <span className="text-green-600">Matches</span>
                    </h2>
                    <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">AI-Curated talent for your industry</p>
                </div>
            </div>
            <Button variant="ghost" className="font-black text-[11px] uppercase tracking-widest text-blue-700 hover:bg-blue-50 rounded-xl px-6">
              Explore All Talent
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TALENT_ITEMS.map((student) => {
              const matchPercentage = parseInt(student.match);
              const circumference = 2 * Math.PI * 45;
              const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;
              
              const matchColor = matchPercentage >= 95 ? "#10b981" : matchPercentage >= 90 ? "#3b82f6" : "#f59e0b";

              return (
                <Card key={student.name} className="group p-8 border-none rounded-[35px] bg-white shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative w-32 h-32 mb-6">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle
                          cx="50" cy="50" r="45" fill="none"
                          stroke={matchColor}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900">{matchPercentage}%</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Match</span>
                      </div>
                    </div>

                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 font-black text-2xl mb-4 shadow-inner">
                        {student.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">{student.name}</h3>
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-1 bg-blue-50 px-3 py-1 rounded-full">{student.role}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">Core Expertise</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {student.skills.map((skill) => (
                        <span key={skill} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-600 uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => handleContactTalent(student.name)} className="w-full bg-slate-900 hover:bg-blue-700 text-white rounded-2xl py-7 font-black text-[11px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3">
                    Inquire Now <ArrowUpRight size={18} />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* --- NOTIFICATION TOAST --- */}
        {notificationMessage && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-green-600 text-white px-10 py-5 rounded-4xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3">
              <ShieldCheck size={20} /> {notificationMessage}
            </div>
          </div>
        )}

          </>
        )}
      </div>
    </DashboardLayout>
  );
};

// --- REFINED STAT CARD COMPONENT ---
const StatCard = ({
  label,
  value,
  tone,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  tone: "blue" | "orange" | "green";
  icon: React.ReactNode;
  onClick?: () => void;
}) => {
    const tones = {
        blue: "bg-blue-50 border-blue-100 text-blue-700 shadow-blue-100/50",
        orange: "bg-orange-50 border-orange-100 text-orange-700 shadow-orange-100/50",
        green: "bg-green-50 border-green-100 text-green-700 shadow-green-100/50",
    };

    return (
        <Card
          className={`p-8 border-none rounded-[35px] shadow-xl transition-transform hover:scale-[1.02] duration-300 flex items-center gap-6 ${tones[tone]} ${onClick ? "cursor-pointer" : ""}`}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          onClick={onClick}
        >
          <div className="p-4 rounded-4xl bg-white shadow-sm">{icon}</div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
          </div>
        </Card>
    );
};