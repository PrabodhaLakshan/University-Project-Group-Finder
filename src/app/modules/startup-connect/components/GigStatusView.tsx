"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BadgeCheck, Briefcase, Clock3, FileText, Loader2, UserRound, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";

type GigStatusCounts = {
  total: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
};

type GigStatusItem = {
  id: string;
  title: string;
  status: string;
  budget: string;
  postedAt: string;
  counts: GigStatusCounts;
};

type GigApplicationItem = {
  id: string;
  gigId: string;
  userId: string;
  motivation: string;
  resumeUrl: string;
  status: string;
  isCompletionApproved?: boolean;
  appliedAt: string;
  applicant: {
    id: string;
    name: string;
    skills: string[];
    role: string;
    rating: string;
    avatar: string | null;
  } | null;
};

const PAGE_SIZE = 6;

function statusPillClass(status: string) {
  const upper = status.trim().toUpperCase();
  if (upper === "OPEN") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (upper === "CLOSED") return "border-slate-200 bg-slate-100 text-slate-700";
  if (upper === "APPROVED") return "border-sky-200 bg-sky-50 text-sky-700";
  if (upper === "REJECTED") return "border-red-200 bg-red-50 text-red-700";
  if (upper === "PENDING") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function normalizeApiData(data: unknown): GigStatusItem[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter((row): row is GigStatusItem => Boolean(row && typeof row === "object"))
    .map((row) => ({
      id: String((row as GigStatusItem).id ?? ""),
      title: String((row as GigStatusItem).title ?? "Untitled Gig"),
      status: String((row as GigStatusItem).status ?? "PENDING"),
      budget: String((row as GigStatusItem).budget ?? ""),
      postedAt: String((row as GigStatusItem).postedAt ?? ""),
      counts: {
        total: Number((row as GigStatusItem).counts?.total ?? 0),
        pending: Number((row as GigStatusItem).counts?.pending ?? 0),
        reviewed: Number((row as GigStatusItem).counts?.reviewed ?? 0),
        accepted: Number((row as GigStatusItem).counts?.accepted ?? 0),
        rejected: Number((row as GigStatusItem).counts?.rejected ?? 0),
      },
    }))
    .filter((row) => row.id.length > 0);
}

export function GigStatusView() {
  const [items, setItems] = useState<GigStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyGigId, setBusyGigId] = useState<string | null>(null);
  const [expandedGigId, setExpandedGigId] = useState<string | null>(null);
  const [loadingApplicationsGigId, setLoadingApplicationsGigId] = useState<string | null>(null);
  const [busyApplicationId, setBusyApplicationId] = useState<string | null>(null);
  const [applicationsByGig, setApplicationsByGig] = useState<Record<string, GigApplicationItem[]>>({});
  const [selectedApplicationByGig, setSelectedApplicationByGig] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setItems([]);
      setError("Sign in as a startup to view gig status.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/startup-connect/dashboard/gig-status", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        data?: unknown;
      };

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Could not load gig status");
      }

      setItems(normalizeApiData(json.data));
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : "Could not load gig status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.gigs += 1;
        acc.pending += item.counts.pending;
        acc.accepted += item.counts.accepted;
        return acc;
      },
      { gigs: 0, pending: 0, accepted: 0 }
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const itemStatus = item.status.trim().toUpperCase();
      const matchesStatus = statusFilter === "ALL" || itemStatus === statusFilter;
      const matchesSearch =
        term.length === 0 ||
        item.title.toLowerCase().includes(term) ||
        itemStatus.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [items, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const updateGigStatus = async (gigId: string, status: "OPEN" | "CLOSED") => {
    const token = getToken();
    if (!token) {
      setError("Please sign in again.");
      return;
    }

    setBusyGigId(gigId);
    try {
      const res = await fetch(`/api/startup-connect/gigs/${gigId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Status update failed");
      }

      setItems((prev) =>
        prev.map((item) => (item.id === gigId ? { ...item, status } : item))
      );
        await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status update failed");
    } finally {
      setBusyGigId(null);
    }
  };

  const loadGigApplications = async (gigId: string) => {
    const token = getToken();
    if (!token) {
      setError("Please sign in again.");
      return;
    }

    setLoadingApplicationsGigId(gigId);
    try {
      const res = await fetch(`/api/startup-connect/gigs/${gigId}/applications`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
        data?: GigApplicationItem[];
      };

      if (!res.ok || !json.success || !Array.isArray(json.data)) {
        throw new Error(json.error || "Could not load applications");
      }

      setApplicationsByGig((prev) => ({ ...prev, [gigId]: json.data ?? [] }));
      setSelectedApplicationByGig((prev) => {
        const existing = prev[gigId];
        if (existing) return prev;
        const firstId = json.data?.[0]?.id;
        if (!firstId) return prev;
        return { ...prev, [gigId]: firstId };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load applications");
    } finally {
      setLoadingApplicationsGigId(null);
    }
  };

  const openApplicantsPanel = async (gigId: string) => {
    if (expandedGigId === gigId) {
      setExpandedGigId(null);
      return;
    }

    setExpandedGigId(gigId);
    if (!applicationsByGig[gigId]) {
      await loadGigApplications(gigId);
    }
  };

  const markApplicationDone = async (gigId: string, applicationId: string) => {
    const token = getToken();
    if (!token) {
      setError("Please sign in again.");
      return;
    }

    setBusyApplicationId(applicationId);
    try {
      const res = await fetch(`/api/startup-connect/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "REVIEWED" }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Could not mark as done");
      }

      setApplicationsByGig((prev) => {
        const current = prev[gigId] ?? [];
        const next = current.map((app) => {
          if (app.id !== applicationId) return app;
          return { ...app, isCompletionApproved: true };
        });
        return { ...prev, [gigId]: next };
      });

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== gigId) return item;
          return {
            ...item,
            counts: {
              ...item.counts,
              reviewed: item.counts.reviewed + 1,
            },
          };
        })
      );
        await loadGigApplications(gigId);
        await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not mark as done");
    } finally {
      setBusyApplicationId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900">
          Gig <span className="text-sky-600">Status</span>
        </h1>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          View posted gig status and approve(open) or close each opportunity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Gigs</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{totals.gigs}</p>
        </Card>
        <Card className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Pending Applications</p>
          <p className="mt-2 text-2xl font-black text-amber-800">{totals.pending}</p>
        </Card>
        <Card className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Accepted Applications</p>
          <p className="mt-2 text-2xl font-black text-emerald-800">{totals.accepted}</p>
        </Card>
      </div>

      <Card className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Search</p>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by gig title or status"
              className="h-10"
            />
          </div>
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Status Filter</p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none ring-offset-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            >
              <option value="ALL">All</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Card className="rounded-3xl border border-slate-100 bg-white p-10 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading gig status...
          </div>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-slate-700">No gigs found</p>
          <p className="mt-2 text-xs font-bold text-slate-400">
            No records match your current search/filter. Try clearing filters.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pagedItems.map((gig) => {
            const statusUpper = gig.status.trim().toUpperCase();
            const isBusy = busyGigId === gig.id;
            return (
              <Card
                key={gig.id}
                className="rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">{gig.title}</h2>
                      <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass(gig.status)}`}>
                        {gig.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4" /> Posted: {gig.postedAt || "-"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-4 w-4" /> Budget: {gig.budget || "Negotiable"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isBusy || statusUpper === "OPEN"}
                      onClick={() => void updateGigStatus(gig.id, "OPEN")}
                      className="bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"
                    >
                      <BadgeCheck className="mr-1.5 h-4 w-4" /> Approve / Open
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isBusy || statusUpper === "CLOSED"}
                      onClick={() => void updateGigStatus(gig.id, "CLOSED")}
                      className="border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      <XCircle className="mr-1.5 h-4 w-4" /> Close Gig
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void openApplicantsPanel(gig.id)}
                      className="border-sky-300 text-sky-700 hover:bg-sky-50"
                    >
                      <UserRound className="mr-1.5 h-4 w-4" />
                      {expandedGigId === gig.id ? "Hide Applicants" : "View Applicants"}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-5">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total</p>
                    <p className="text-sm font-black text-slate-800">{gig.counts.total}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-700">Pending</p>
                    <p className="text-sm font-black text-amber-800">{gig.counts.pending}</p>
                  </div>
                  <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-sky-700">Reviewed</p>
                    <p className="text-sm font-black text-sky-800">{gig.counts.reviewed}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Accepted</p>
                    <p className="text-sm font-black text-emerald-800">{gig.counts.accepted}</p>
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-700">Rejected</p>
                    <p className="text-sm font-black text-red-800">{gig.counts.rejected}</p>
                  </div>
                </div>

                {expandedGigId === gig.id && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                    {loadingApplicationsGigId === gig.id ? (
                      <div className="flex items-center justify-center gap-2 py-8 text-sm font-bold text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading applicants...
                      </div>
                    ) : (applicationsByGig[gig.id] ?? []).length === 0 ? (
                      <div className="py-6 text-center text-xs font-bold text-slate-500">
                        No applications for this gig yet.
                      </div>
                    ) : (
                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="space-y-2 lg:col-span-1">
                          {(applicationsByGig[gig.id] ?? []).map((app) => {
                            const appStatus = app.status.trim().toUpperCase();
                            const isSelected = selectedApplicationByGig[gig.id] === app.id;
                            return (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() =>
                                  setSelectedApplicationByGig((prev) => ({ ...prev, [gig.id]: app.id }))
                                }
                                className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                                  isSelected
                                    ? "border-sky-300 bg-sky-50"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                              >
                                <p className="text-xs font-black text-slate-900">
                                  {app.applicant?.name || "Applicant"}
                                </p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                  {appStatus}
                                </p>
                              </button>
                            );
                          })}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                          {(() => {
                            const selectedId = selectedApplicationByGig[gig.id];
                            const selectedApp = (applicationsByGig[gig.id] ?? []).find((app) => app.id === selectedId);

                            if (!selectedApp) {
                              return (
                                <p className="text-sm font-bold text-slate-500">
                                  Select an application to view applicant details.
                                </p>
                              );
                            }

                            const selectedStatus = selectedApp.status.trim().toUpperCase();
                            const isCompleted = Boolean(selectedApp.isCompletionApproved);
                            const canMarkDone = selectedStatus === "ACCEPTED" && !isCompleted;

                            return (
                              <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <h3 className="text-base font-black text-slate-900">
                                    {selectedApp.applicant?.name || "Applicant"}
                                  </h3>
                                  <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusPillClass(isCompleted ? "APPROVED" : selectedStatus)}`}>
                                    {isCompleted ? "Completed" : selectedStatus}
                                  </span>
                                </div>

                                <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                                  <p>
                                    <span className="font-black text-slate-800">Role:</span>{" "}
                                    {selectedApp.applicant?.role || "-"}
                                  </p>
                                  <p>
                                    <span className="font-black text-slate-800">Rating:</span>{" "}
                                    {selectedApp.applicant?.rating || "-"}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Skills</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {(selectedApp.applicant?.skills ?? []).length === 0 ? (
                                      <span className="text-xs font-bold text-slate-400">No skills listed</span>
                                    ) : (
                                      (selectedApp.applicant?.skills ?? []).map((skill) => (
                                        <span
                                          key={skill}
                                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-700"
                                        >
                                          {skill}
                                        </span>
                                      ))
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Motivation</p>
                                  <p className="mt-1 text-sm font-semibold text-slate-700">
                                    {selectedApp.motivation || "No motivation provided."}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {selectedApp.resumeUrl ? (
                                    <a
                                      href={selectedApp.resumeUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50"
                                    >
                                      <FileText className="mr-1.5 h-4 w-4" /> View CV
                                    </a>
                                  ) : null}

                                  <Button
                                    type="button"
                                    size="sm"
                                    disabled={!canMarkDone || busyApplicationId === selectedApp.id}
                                    onClick={() => void markApplicationDone(gig.id, selectedApp.id)}
                                    className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                                  >
                                    <BadgeCheck className="mr-1.5 h-4 w-4" />
                                    {isCompleted ? "Marked Done" : "Mark as Done"}
                                  </Button>
                                </div>

                                <p className="text-[11px] font-bold text-slate-500">
                                  Note: "Mark as Done" is enabled only for accepted applications. Once marked done,
                                  that student can submit a startup review.
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row">
            <p className="text-xs font-bold text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredItems.length)} of {filteredItems.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                Page {page} / {totalPages}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
