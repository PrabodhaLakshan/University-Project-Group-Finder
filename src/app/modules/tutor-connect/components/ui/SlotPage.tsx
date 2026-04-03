"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  XCircle,
  Pencil,
  ArrowRightCircle,
  Sparkles,
  Loader2,
  Inbox,
} from "lucide-react";
import { getToken } from "@/lib/auth";

type ApiSlot = {
  id: string;
  subject: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean | null;
  tutor_bookings?: unknown | null;
};

type UiSlot = {
  id: string;
  subject: string;
  date: string;
  time: string;
  students: number;
  status: "Available" | "Booked";
};

export default function SlotsPage() {
  const [slots, setSlots] = useState<UiSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/tutor-connect/slots", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const message = await res.text();
        setError(message || "Failed to load slots");
        setLoading(false);
        return;
      }
      const data: ApiSlot[] = await res.json();
      const formatted: UiSlot[] = data.map((slot) => {
        const dateObj = new Date(slot.slot_date);
        const timeObj = new Date(slot.slot_time);
        return {
          id: slot.id,
          subject: slot.subject,
          date: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: timeObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          students: slot.is_booked ? 1 : 0,
          status: slot.is_booked ? "Booked" : "Available",
        };
      });
      setSlots(formatted);
    } catch (err) {
      console.error("Load slots error:", err);
      setError("Something went wrong while loading slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const totalSlots = useMemo(() => slots.length, [slots]);

  const handleDelete = async (slotId: string) => {
    try {
      setDeletingId(slotId);
      const token = getToken();
      if (!token) {
        setError("You are not logged in.");
        return;
      }
      const res = await fetch(`/api/tutor-connect/slots/${slotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const message = await res.text();
        setError(message || "Failed to delete slot");
        return;
      }
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (err) {
      console.error("Delete slot error:", err);
      setError("Something went wrong while deleting the slot.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-6 px-4">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Tutor Dashboard
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Active Slots
          </h2>
          <p className="text-slate-500 font-medium">
            Manage your teaching schedule and student bookings
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold">
            {totalSlots} <span className="text-slate-400 font-medium ml-1">Total</span>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-slate-300">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Syncing your schedule...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-[24px] p-6 flex items-center gap-4 text-red-700">
          <div className="bg-red-100 p-2 rounded-full">
            <XCircle className="w-6 h-6" />
          </div>
          <p className="font-semibold">{error}</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No active slots found</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-8">
            You haven't scheduled any tutoring sessions yet. Start by adding your availability.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Create First Slot
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="group relative bg-white border border-slate-200 rounded-[28px] p-2 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-blue-200 overflow-hidden"
            >
              {/* Decorative Background Blur */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Subject Icon & Title */}
                <div className="flex items-center gap-5 flex-1">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 shadow-inner">
                    <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {slot.subject}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg border ${
                        slot.status === "Available" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-[1.5]">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">{slot.date}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">{slot.time}</span>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors ${
                    slot.students > 0 
                      ? "bg-blue-50/50 border-blue-100 text-blue-700" 
                      : "bg-slate-50/50 border-slate-100 text-slate-500"
                  }`}>
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {slot.students} Student{slot.students !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-12 px-6 rounded-2xl font-bold text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(slot.id)}
                    disabled={deletingId === slot.id}
                    className="h-12 px-6 rounded-2xl font-bold text-sm bg-slate-50 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                  >
                    {deletingId === slot.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>{deletingId === slot.id ? "..." : "Cancel"}</span>
                  </button>
                  
                  <button
                    disabled
                    className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center opacity-20 cursor-not-allowed transition-all"
                  >
                    <ArrowRightCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
