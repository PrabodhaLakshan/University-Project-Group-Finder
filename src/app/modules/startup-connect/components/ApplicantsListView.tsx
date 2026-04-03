"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Check,
  X,
  Eye,
  MessageCircle,
  Calendar,
  Star,
  Github,
  Briefcase,
  Loader2,
  Linkedin,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { sendApplicantChatMessage } from "../services/notification.service";

type ApplicantRow = {
  id: string;
  name: string;
  date: string;
  status: string;
  rawStatus: string;
  image: string;
  skills: string[];
  experience: string;
  rating: number | null;
  portfolio: string;
  motivation: string;
  githubUrl: string;
  linkedinUrl: string;
  userId: string;
};

type GigGroup = {
  id: string;
  title: string;
  budget: string;
  timeline: string;
  applicants: ApplicantRow[];
};

type ChatMessage = {
  id: string;
  role: "company";
  text: string;
  sentAt: string;
};

const CHAT_STORAGE_PREFIX = "startup_connect_chat_";

function loadThread(applicationId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${CHAT_STORAGE_PREFIX}${applicationId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === "object" &&
        (m as ChatMessage).role === "company" &&
        typeof (m as ChatMessage).text === "string"
    );
  } catch {
    return [];
  }
}

function saveThread(applicationId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(`${CHAT_STORAGE_PREFIX}${applicationId}`, JSON.stringify(messages));
  } catch {
    /* ignore quota */
  }
}

/** Resume URL from API: absolute URL or site-relative path under /public */
function cvPublicHref(path: string): string {
  const p = path.trim();
  if (!p) return "#";
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return p.startsWith("/") ? p : `/${p}`;
}

export const ApplicantsListView: React.FC = () => {
  const [gigs, setGigs] = useState<GigGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedGig, setExpandedGig] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [chatApplicant, setChatApplicant] = useState<ApplicantRow | null>(null);
  const [chatGigTitle, setChatGigTitle] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoadError("Sign in as a startup to view applications.");
      setGigs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/startup-connect/dashboard/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { success?: boolean; data?: GigGroup[]; error?: string };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Could not load applications");
      }
      setGigs(json.data);
      setExpandedGig((prev) => {
        if (prev && json.data!.some((g) => g.id === prev)) return prev;
        return json.data![0]?.id ?? null;
      });
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load");
      setGigs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch("/api/startup-connect/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = (await res.json()) as {
          data?: { profile?: { name?: string } };
          profile?: { name?: string };
        };
        const name = json.data?.profile?.name ?? json.profile?.name;
        if (!cancelled && typeof name === "string" && name.trim()) {
          setCompanyName(name.trim());
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!chatApplicant) {
      setChatMessages([]);
      setChatInput("");
      return;
    }
    setChatMessages(loadThread(chatApplicant.id));
    setChatInput("");
  }, [chatApplicant]);

  const openChat = (applicant: ApplicantRow, gigTitle: string) => {
    setChatApplicant(applicant);
    setChatGigTitle(gigTitle);
  };

  const closeChat = () => {
    setChatApplicant(null);
    setChatGigTitle("");
    setChatInput("");
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!chatApplicant || !text || chatSending) return;
    if (text.length < 2) {
      setToastMessage("Message must be at least 2 characters.");
      setTimeout(() => setToastMessage(""), 2500);
      return;
    }
    const receiverId = chatApplicant.userId?.trim();
    if (!receiverId) {
      setToastMessage("Cannot send: missing student account.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    const id = crypto.randomUUID();
    const sentAt = new Date().toISOString();
    const nextMsg: ChatMessage = { id, role: "company", text, sentAt };
    setChatMessages((prev) => {
      const merged = [...prev, nextMsg];
      saveThread(chatApplicant.id, merged);
      return merged;
    });
    setChatInput("");
    setChatSending(true);
    try {
      await sendApplicantChatMessage({
        receiverId,
        companyName: companyName || "Your startup",
        message: text,
        gigTitle: chatGigTitle || undefined,
      });
      setToastMessage("Message sent");
      setTimeout(() => setToastMessage(""), 2200);
    } catch {
      setChatMessages((prev) => {
        const rolled = prev.filter((m) => m.id !== id);
        saveThread(chatApplicant.id, rolled);
        return rolled;
      });
      setChatInput(text);
      setToastMessage("Could not send. Try again.");
      setTimeout(() => setToastMessage(""), 3500);
    } finally {
      setChatSending(false);
    }
  };

  const patchStatus = async (applicationId: string, status: "ACCEPTED" | "REJECTED" | "REVIEWED") => {
    const token = getToken();
    if (!token) return;
    setActionId(applicationId);
    try {
      const res = await fetch(`/api/startup-connect/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        window.alert(json.error || "Update failed");
        return;
      }
      await load();
    } finally {
      setActionId(null);
    }
  };

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

  const displayCompany = companyName || "Your startup";

  return (
    <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="min-w-0 flex-1 space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900">
            Manage <span className="text-blue-600">Applications</span>
          </h2>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Applicants from Browse Gigs, grouped by gig
          </p>
        </div>

        {loadError && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
            {loadError}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white py-16 text-sm font-bold text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading applications…
          </div>
        )}

        {!loading && !loadError && gigs.length === 0 && (
          <Card className="rounded-[28px] border border-dashed border-slate-200 p-10 text-center">
            <p className="text-sm font-black text-slate-700">No gigs yet</p>
            <p className="mt-2 text-xs font-bold text-slate-400">
              Post a gig from your dashboard; applications from students will appear here per gig.
            </p>
          </Card>
        )}

        {!loading &&
          gigs.map((gig) => (
            <Card key={gig.id} className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedGig(expandedGig === gig.id ? null : gig.id)}
                className="w-full bg-linear-to-r from-blue-50 to-slate-50 p-6 text-left transition-colors hover:from-blue-100 hover:to-slate-100 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-black uppercase tracking-tighter text-slate-900 md:text-2xl">
                      {gig.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Briefcase size={16} className="text-blue-600" />
                        Budget: <span className="font-black text-blue-600">{gig.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Calendar size={16} className="text-orange-600" />
                        Posted: <span className="font-black text-orange-600">{gig.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <span className="inline-block rounded-lg border border-slate-100 bg-white px-3 py-1 font-black text-blue-600">
                          {gig.applicants.length} {gig.applicants.length === 1 ? "Applicant" : "Applicants"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl text-slate-400">{expandedGig === gig.id ? "▼" : "▶"}</div>
                </div>
              </button>

              {expandedGig === gig.id && (
                <div className="border-t border-slate-100 bg-white p-6 md:p-8">
                  {gig.applicants.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="font-bold italic text-slate-400">No applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {gig.applicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className={cn(
                            "rounded-3xl border-2 p-5 transition-all",
                            selectedApplicant?.id === applicant.id
                              ? "border-blue-200 bg-blue-50 shadow-md"
                              : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div className="flex flex-1 items-start gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 text-lg font-black text-white">
                                {applicant.image}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <h4 className="text-base font-black uppercase text-slate-900">{applicant.name}</h4>
                                  <span
                                    className={cn(
                                      "rounded-lg border px-3 py-1 text-[10px] font-black",
                                      getStatusColor(applicant.status)
                                    )}
                                  >
                                    {applicant.status}
                                  </span>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                                  <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Profile</p>
                                    <p className="text-sm font-black text-slate-900">{applicant.experience}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Rating</p>
                                    <div className="mt-0.5 flex items-center gap-1">
                                      {applicant.rating != null ? (
                                        <>
                                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                          <span className="text-sm font-black text-slate-900">
                                            {applicant.rating.toFixed(1)}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-sm font-bold text-slate-400">—</span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Applied on</p>
                                    <p className="text-sm font-black text-slate-900">{applicant.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Resume / CV</p>
                                    <p className="truncate text-sm font-black text-slate-900">
                                      {applicant.portfolio ? "Attached" : "—"}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3">
                                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Key Skills</p>
                                  <div className="flex flex-wrap gap-2">
                                    {applicant.skills.length ? (
                                      applicant.skills.map((skill) => (
                                        <span
                                          key={skill}
                                          className="rounded-lg border border-blue-100 bg-white px-2.5 py-1 text-[10px] font-bold uppercase text-blue-600"
                                        >
                                          {skill}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-xs font-bold text-slate-400">—</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 border-t pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 xl:flex-row">
                              <Button
                                type="button"
                                onClick={() => {
                                  setSelectedApplicant(applicant);
                                  setIsDialogOpen(true);
                                }}
                                className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-sky-100 px-4 text-[10px] font-black uppercase text-sky-600 hover:bg-sky-200 lg:flex-none"
                              >
                                <Eye size={16} /> View Profile
                              </Button>
                              {applicant.portfolio ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex h-10 flex-1 items-center gap-2 rounded-xl border-violet-200 bg-violet-50 px-4 text-[10px] font-black uppercase text-violet-700 hover:bg-violet-100 lg:flex-none"
                                  asChild
                                >
                                  <a href={cvPublicHref(applicant.portfolio)} target="_blank" rel="noopener noreferrer">
                                    <FileText size={16} />
                                    View CV
                                  </a>
                                </Button>
                              ) : null}
                              <Button
                                type="button"
                                disabled={actionId === applicant.id || applicant.rawStatus === "ACCEPTED"}
                                onClick={() => void patchStatus(applicant.id, "ACCEPTED")}
                                className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-green-100 px-4 text-[10px] font-black uppercase text-green-600 hover:bg-green-200 lg:flex-none"
                              >
                                <Check size={16} /> Accept
                              </Button>
                              <Button
                                type="button"
                                disabled={actionId === applicant.id || applicant.rawStatus === "REJECTED"}
                                onClick={() => void patchStatus(applicant.id, "REJECTED")}
                                className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-red-100 px-4 text-[10px] font-black uppercase text-red-600 hover:bg-red-200 lg:flex-none"
                              >
                                <X size={16} /> Reject
                              </Button>
                              <Button
                                type="button"
                                onClick={() => openChat(applicant, gig.title)}
                                className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-linear-to-r from-sky-100 to-blue-100 px-4 text-[10px] font-black uppercase text-blue-800 ring-1 ring-blue-200/60 hover:from-sky-200 hover:to-blue-200 lg:flex-none"
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

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedApplicant(null);
          }}
        >
          {selectedApplicant && (
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">
                    {selectedApplicant.image}
                  </span>
                  <span className="text-base font-black uppercase tracking-tight text-slate-900">
                    {selectedApplicant.name}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Applicant profile & application
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Profile summary</p>
                    <p className="font-black text-slate-900">{selectedApplicant.experience}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Rating</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      {selectedApplicant.rating != null ? (
                        <>
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-black text-slate-900">{selectedApplicant.rating.toFixed(1)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-slate-400">—</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Applied on</p>
                    <p className="font-black text-slate-900">{selectedApplicant.date}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-lg border px-3 py-1 text-[10px] font-black",
                        getStatusColor(selectedApplicant.status)
                      )}
                    >
                      {selectedApplicant.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Motivation</p>
                  <p className="text-sm font-medium leading-relaxed text-slate-600">{selectedApplicant.motivation}</p>
                </div>

                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Key Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-blue-100 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedApplicant.portfolio ? (
                  <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      Portfolio / CV
                    </p>
                    <Button
                      type="button"
                      className="w-full gap-2 rounded-xl bg-violet-600 py-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-violet-800 sm:w-auto"
                      asChild
                    >
                      <a href={cvPublicHref(selectedApplicant.portfolio)} target="_blank" rel="noopener noreferrer">
                        <FileText size={16} />
                        View CV in new tab
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  {selectedApplicant.githubUrl ? (
                    <a
                      href={selectedApplicant.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-slate-700 hover:text-blue-600"
                    >
                      <Github size={14} /> GitHub
                    </a>
                  ) : null}
                  {selectedApplicant.linkedinUrl ? (
                    <a
                      href={selectedApplicant.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-slate-700 hover:text-blue-600"
                    >
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  ) : null}
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>

      <Dialog
        open={!!chatApplicant}
        onOpenChange={(open) => {
          if (!open) closeChat();
        }}
      >
        {chatApplicant && (
          <DialogContent className="max-w-xl sm:max-w-2xl border-0 bg-transparent shadow-none">
            <DialogTitle className="sr-only">
              {`Chat with ${chatApplicant.name}${chatGigTitle ? ` about ${chatGigTitle}` : ""}`}
            </DialogTitle>
            <div className="flex h-[min(560px,78vh)] w-full flex-col overflow-hidden rounded-[28px] border border-sky-200/70 bg-linear-to-b from-white via-sky-50/40 to-orange-50/30 shadow-[0_18px_50px_-14px_rgba(59,130,246,0.2)] ring-1 ring-sky-100/50">
              <div className="border-b border-sky-100/80 bg-linear-to-r from-blue-600 via-sky-600 to-emerald-600 px-4 py-4 text-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/85">Your company</p>
                    <p className="truncate text-lg font-black tracking-tight">{displayCompany}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-white/95">
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur-sm">
                        To: <span className="font-black">{chatApplicant.name}</span>
                      </span>
                      {chatGigTitle ? (
                        <span className="truncate rounded-full bg-black/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wide">
                          {chatGigTitle}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeChat}
                    className="shrink-0 rounded-xl bg-white/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-sm transition hover:bg-white/30"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col bg-white/50">
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {chatMessages.length === 0 ? (
                    <p className="text-center text-[12px] font-medium leading-relaxed text-slate-500">
                      Say hello from <span className="font-black text-blue-700">{displayCompany}</span>. Messages are
                      delivered to the student as notifications.
                    </p>
                  ) : (
                    chatMessages.map((m) => (
                      <div key={m.id} className="flex justify-end">
                        <div className="max-w-[92%] rounded-2xl rounded-br-md bg-linear-to-br from-blue-600 to-sky-600 px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-white shadow-md">
                          <p className="whitespace-pre-wrap wrap-break-word">{m.text}</p>
                          <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/75">
                            {displayCompany} ·{" "}
                            {new Date(m.sentAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-sky-100/80 bg-white/90 p-3">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    rows={3}
                    placeholder={`Write as ${displayCompany}…`}
                    className="resize-none rounded-2xl border-sky-200/80 bg-white text-[13px] focus-visible:ring-sky-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void sendChatMessage();
                      }
                    }}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-slate-200 text-[11px] font-black uppercase"
                      onClick={closeChat}
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      disabled={!chatInput.trim() || chatSending}
                      className="rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 text-[11px] font-black uppercase tracking-widest text-white shadow-md hover:from-blue-700 hover:to-emerald-700"
                      onClick={() => void sendChatMessage()}
                    >
                      {chatSending ? "Sending…" : "Send"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 z-100 -translate-x-1/2 animate-in slide-in-from-bottom-10 duration-500">
          <div
            className={cn(
              "rounded-3xl px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-2xl",
              toastMessage.includes("Could not") || toastMessage.includes("Cannot")
                ? "bg-red-600"
                : "bg-linear-to-r from-emerald-600 to-sky-600"
            )}
          >
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
