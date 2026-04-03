"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  XCircle,
  Pencil,
  Sparkles,
  Loader2,
  Inbox,
  MapPin,
  X, // Aluthen add kala modal ekata
} from "lucide-react";
import { getToken } from "@/lib/auth";

type ApiSlot = {
  id: string;
  subject: string;
  slot_date: string;
  slot_time: string;
  location: string | null;
  is_booked: boolean | null;
  tutor_bookings?: unknown | null;
};

type UiSlot = {
  id: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  students: number;
  status: "Available" | "Booked";
  rawDate: string; // Modal ekata ona nisa
  rawTime: string;
};

export default function SlotsPage() {
  const [slots, setSlots] = useState<UiSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- EDIT STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<UiSlot | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
          location: slot.location || "Not Specified",
          students: slot.is_booked ? 1 : 0,
          status: slot.is_booked ? "Booked" : "Available",
          rawDate: slot.slot_date.split("T")[0],
          rawTime: timeObj.toTimeString().slice(0, 5),
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
      if (!token) return;
      const res = await fetch(`/api/tutor-connect/slots/${slotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  // --- UPDATE LOGIC ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    setIsUpdating(true);
    try {
      const token = getToken();
      const res = await fetch(`/api/tutor-connect/slots/${editingSlot.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: editingSlot.rawDate,
          time: editingSlot.rawTime,
          subject: editingSlot.subject,
          location: editingSlot.location,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadSlots();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* HEADER SECTION */}
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

      {/* CONTENT SECTION */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border border-dashed border-slate-300">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Syncing your schedule...</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="group relative bg-white border border-slate-200 rounded-[28px] p-2 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-blue-200 overflow-hidden"
            >
              <div className="relative z-10 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-5 flex-1">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 shadow-inner">
                    <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {slot.subject}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg border ${slot.status === "Available" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                        {slot.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-[2.5]">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">{slot.date}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">{slot.time}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-100 group-hover:bg-white transition-colors">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{slot.location}</span>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors ${slot.students > 0 ? "bg-blue-50/50 border-blue-100 text-blue-700" : "bg-slate-50/50 border-slate-100 text-slate-500"}`}>
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-bold">{slot.students} Student(s)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingSlot(slot); setIsModalOpen(true); }}
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
                    {deletingId === slot.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- EDIT MODAL --- */}
{isModalOpen && editingSlot && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 space-y-6 border border-slate-100">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-extrabold text-slate-900">Edit Session</h3>
        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Subject</label>
          <input 
            type="text" 
            value={editingSlot.subject} 
            onChange={e => setEditingSlot({...editingSlot, subject: e.target.value})} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-semibold text-slate-900" // text-slate-900 add kala
            required 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Date</label>
            <input 
              type="date" 
              value={editingSlot.rawDate} 
              onChange={e => setEditingSlot({...editingSlot, rawDate: e.target.value})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold text-slate-900" // text-slate-900 add kala
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Time</label>
            <input 
              type="time" 
              value={editingSlot.rawTime} 
              onChange={e => setEditingSlot({...editingSlot, rawTime: e.target.value})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold text-slate-900" // text-slate-900 add kala
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Location</label>
          <input 
            type="text" 
            value={editingSlot.location === "Not Specified" ? "" : editingSlot.location} 
            onChange={e => setEditingSlot({...editingSlot, location: e.target.value})} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold text-slate-900" // text-slate-900 add kala
            placeholder="e.g. Library" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isUpdating} 
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
        >
          {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
}