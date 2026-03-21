"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Zap, Briefcase, Bell, ArrowUpRight, User, Star, Github, ExternalLink } from "lucide-react";
import { PostGigModal } from "./PostGigModal";
import { AddProjectModal } from "./AddProjectModal";

type StartupProfile = {
  name: string;
  industry: string;
  about: string;
  logo: File | null;
  certificates: File[];
};

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
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [certificateImageFailed, setCertificateImageFailed] = useState(false);
  const [certificateSrcIndex, setCertificateSrcIndex] = useState(0);
  const [startupProfile, setStartupProfile] = useState<StartupProfile>({
    name: data?.name || "Startup",
    industry: data?.industry || "Technology",
    about: data?.about || "",
    logo: data?.logo ?? null,
    certificates: Array.isArray(data?.certificates) ? data.certificates : [],
  });
  const [editForm, setEditForm] = useState<StartupProfile>({
    name: data?.name || "Startup",
    industry: data?.industry || "Technology",
    about: data?.about || "",
    logo: data?.logo ?? null,
    certificates: Array.isArray(data?.certificates) ? data.certificates : [],
  });
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [recentWorks, setRecentWorks] = useState<RecentWorkItem[]>(INITIAL_RECENT_WORKS);

  const handleContactTalent = (talentName: string) => {
    setNotificationMessage(`Send notification to ${talentName}`);
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  useEffect(() => {
    const nextData: StartupProfile = {
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

  const certificates = Array.isArray(startupProfile.certificates) ? startupProfile.certificates : [];
  const displayName = startupProfile.name || "Startup";
  const displayIndustry = startupProfile.industry || "Technology";

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 px-4 md:px-8 pb-10">
      <PostGigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 md:px-10 py-4 flex justify-between items-center z-50 shadow-sm">
        <div className="text-2xl font-black italic tracking-tighter text-slate-900">
          UNI<span className="text-blue-700">NEXUS</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <Link href="/startup-connect" className="px-4 py-2 rounded-xl hover:bg-white hover:text-blue-700 transition-colors flex items-center gap-2">
            <User size={14} /> Account
          </Link>
          <Link href="/startup-connect/talent-pool" className="px-4 py-2 rounded-xl hover:bg-white hover:text-blue-700 transition-colors flex items-center gap-2">
            <Users size={14} /> Talent Pool
          </Link>
          <Link href="/startup-connect/applicants" className="px-4 py-2 rounded-xl hover:bg-white hover:text-blue-700 transition-colors flex items-center gap-2">
            <Briefcase size={14} /> Applications
          </Link>
          <Link href="/dashboard/startup" className="px-4 py-2 rounded-xl hover:bg-white hover:text-blue-700 transition-colors flex items-center gap-2">
            <Star size={14} /> Reviews
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="p-2 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-colors">
            <Bell size={18} />
          </button>
          <div className="w-10 h-10 bg-blue-700 rounded-xl text-white flex items-center justify-center font-black uppercase tracking-tighter border-2 border-blue-100 shadow-sm">
            {displayName.charAt(0)}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="p-6 md:p-8 border border-slate-100 rounded-3xl bg-white shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-24 h-24 rounded-[28px] overflow-hidden border-4 border-blue-100 bg-white shadow-lg shadow-blue-100/30 flex items-center justify-center text-3xl font-black text-blue-700">
                {logoPreviewUrl ? (
                  <img src={logoPreviewUrl} alt="Business logo" className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0)
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">
                  Welcome, <span className="text-blue-700">{displayName}</span>
                </h1>
                <p className="text-slate-500 font-bold italic mt-1">{displayIndustry} Innovation Sector</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3 rounded-xl font-black text-[11px] shadow-lg shadow-orange-100 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus size={16} strokeWidth={3} /> NEW GIG
              </button>
            </div>
          </div>
        </Card>

        {isManageOpen && (
          <Card className="p-6 border border-blue-100 bg-blue-50/40 rounded-3xl shadow-sm">
            <h3 className="text-sm font-black uppercase text-blue-700 tracking-widest mb-5">Edit Startup Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Startup Name</label>
                <Input
                  value={editForm.name}
                  className="rounded-xl border-slate-100 bg-white py-5 font-bold"
                  onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Industry</label>
                <Input
                  value={editForm.industry}
                  className="rounded-xl border-slate-100 bg-white py-5 font-bold"
                  onChange={(event) => setEditForm((prev) => ({ ...prev, industry: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2 mt-5">
              <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Short Pitch</label>
              <Textarea
                value={editForm.about}
                className="rounded-xl border-slate-100 bg-white font-bold min-h-24"
                onChange={(event) => setEditForm((prev) => ({ ...prev, about: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Business Logo</label>
                <Input
                  type="file"
                  accept="image/*"
                  className="rounded-xl border-slate-100 bg-white py-2.5 font-bold"
                  onChange={handleEditLogoChange}
                />
                {editForm.logo && <p className="text-[10px] font-bold text-slate-500">Selected: {editForm.logo.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Certificates</label>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="rounded-xl border-slate-100 bg-white py-2.5 font-bold"
                  onChange={handleEditCertificatesChange}
                />
                {editForm.certificates.length > 0 && <p className="text-[10px] font-bold text-slate-500">{editForm.certificates.length} file(s) selected</p>}
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button type="button" variant="ghost" onClick={handleCancelManage} className="rounded-xl font-black text-[10px] uppercase">
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveProfile} className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-black text-[10px] uppercase">
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard label="Live Gigs" value="04" tone="blue" icon={<Briefcase size={18} />} />
          <StatCard label="Applications" value="28" tone="orange" icon={<Users size={18} />} />
          <StatCard label="Total Reach" value="1.2k" tone="blue" icon={<Zap size={18} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm lg:col-span-7">
            <h3 className="text-[10px] font-black uppercase text-blue-700 tracking-[0.2em] mb-3 underline decoration-2">Company Vision</h3>
            <p className="text-lg md:text-xl font-bold text-slate-600 italic leading-relaxed">
              "{startupProfile.about || "Your startup mission will appear here once you post your first gig."}"
            </p>
          </Card>

          <Card className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm lg:col-span-5">
            <h3 className="text-[10px] font-black uppercase text-blue-700 tracking-[0.2em] mb-4 underline decoration-2">Registration Assets</h3>

            <div className="space-y-4">
              
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Certificates</p>
                <div className="mb-3 rounded-2xl border border-slate-100 bg-slate-50 p-2">
                  <div className="h-36 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                    {certificateImageFailed ? (
                      <img
                        src="/file.svg"
                        alt="Certificate placeholder"
                        className="w-14 h-14 object-contain opacity-70"
                      />
                    ) : (
                      <img
                        src={CERTIFICATE_IMAGE_SOURCES[certificateSrcIndex]}
                        alt="Business registration certificate"
                        className="w-full h-full object-contain"
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
                  <p className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {certificateImageFailed ? "Certificate image not found" : "Business Registration Certification"}
                  </p>
                </div>

                {certificates.length > 0 ? (
                  <ul className="space-y-2 max-h-28 overflow-y-auto pr-1">
                    {certificates.map((file: File) => (
                      <li key={`${file.name}-${file.lastModified}`} className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-bold text-slate-400 italic">No certificates uploaded</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 md:p-8 border border-slate-100 rounded-3xl bg-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                Recent <span className="text-blue-700">Works</span>
              </h2>
              <p className="text-slate-500 font-bold italic text-sm mt-1">Add and showcase your latest startup projects with live demos.</p>
            </div>
            <AddProjectModal onAddProject={handleAddRecentWork} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentWorks.map((work) => (
              <div key={work.id} className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-sm hover:shadow-lg hover:shadow-blue-100/30 transition-all">
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 mb-4">
                  <img src={work.images[0]} alt={work.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-black text-slate-900 uppercase leading-tight">{work.title}</h3>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase">{work.date}</span>
                </div>
                <p className="text-sm text-slate-500 font-bold italic mt-2 line-clamp-2">{work.description}</p>

                <div className="flex gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl border-slate-200 font-bold"
                    onClick={() => {
                      if (work.github) {
                        window.open(work.github, "_blank", "noopener,noreferrer");
                      }
                    }}
                  >
                    <Github size={14} className="mr-2" /> Code
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-black text-[11px]"
                    onClick={() => {
                      if (work.demo) {
                        window.open(work.demo, "_blank", "noopener,noreferrer");
                      }
                    }}
                  >
                    Live Demo <ExternalLink size={14} className="ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900">
              Suggested <span className="text-orange-600">Talent</span>
            </h2>
            <p className="text-slate-500 font-bold italic text-sm">Best matches for {displayIndustry} projects</p>
          </div>
          <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest text-blue-700 hover:bg-blue-50">
            View All Talent
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TALENT_ITEMS.map((student) => {
            const matchPercentage = parseInt(student.match);
            const circumference = 2 * Math.PI * 45;
            const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;

            return (
              <Card key={student.name} className="group p-6 border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-300 bg-white overflow-hidden relative">
                <div className="flex items-start gap-5 mb-6">
                  {/* Circular Match Score */}
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={matchPercentage >= 95 ? "#10b981" : matchPercentage >= 90 ? "#3b82f6" : "#f59e0b"}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-900">{matchPercentage}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">MATCH</span>
                    </div>
                  </div>

                  {/* Talent Info */}
                  <div className="flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 font-black text-sm italic mb-2">
                      {student.name.charAt(0)}
                    </div>
                    <h3 className="text-sm font-black italic uppercase text-slate-900 truncate">{student.name}</h3>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1">{student.role}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill) => (
                      <span key={skill} className="bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg text-[9px] font-bold text-blue-700 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button onClick={() => handleContactTalent(student.name)} className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl py-3 font-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group">
                  Contact Talent <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="pt-2 flex justify-center">
          <Button
            onClick={() => {
              setEditForm(startupProfile);
              setIsManageOpen(true);
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-blue-100 transition-all active:scale-95"
          >
            Manage Your Startup
          </Button>
        </div>

        {notificationMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg">
              {notificationMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "blue" | "orange";
  icon: React.ReactNode;
}) => (
  <Card
    className={`p-6 border rounded-3xl shadow-sm flex items-center gap-4 ${
      tone === "blue"
        ? "bg-blue-50 border-blue-100 text-blue-700"
        : "bg-orange-50 border-orange-100 text-orange-700"
    }`}
  >
    <div className="p-3 rounded-xl bg-white/70">{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-3xl font-black italic text-slate-900">{value}</p>
    </div>
  </Card>
);
