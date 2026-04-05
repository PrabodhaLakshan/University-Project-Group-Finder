"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, DollarSign, Calendar, Zap, Plus, Loader2 } from "lucide-react";
import { getToken } from "@/lib/auth";

export interface GigFormValues {
  id?: string;
  title: string;
  budget: string;
  deadline: string;
  description: string;
  skills: string[];
}

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGig?: GigFormValues | null;
  onSubmitGig?: (gig: any) => void;
}

export const PostGigModal = ({ isOpen, onClose, initialGig, onSubmitGig }: PostGigModalProps) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state එකක් එකතු කළා

  const [errors, setErrors] = useState<{
    title?: string;
    budget?: string;
    deadline?: string;
    description?: string;
    skills?: string;
  }>({});

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (initialGig) {
      setTitle(initialGig.title || "");
      setBudget(initialGig.budget || "");
      setDeadline(initialGig.deadline || "");
      setDescription(initialGig.description || "");
      setSkills(initialGig.skills || []);
    } else {
      setTitle("");
      setBudget("");
      setDeadline("");
      setDescription("");
      setSkills([]);
    }

    setSkillInput("");
    setErrors({});
    setShowSuccess(false);
    setIsLoading(false);
  }, [isOpen, initialGig]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const exists = skills.some((s) => s.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
    setErrors((prev) => ({ ...prev, skills: undefined }));
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Only title is required; budget, deadline, skills, description can be filled later.
    if (!trimmedTitle) newErrors.title = "Gig title is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const isEditing = Boolean(initialGig?.id);
        const endpoint = isEditing
          ? `/api/startup-connect/gigs/${initialGig!.id}`
          : '/api/startup-connect/PostGig';
        const method = isEditing ? 'PATCH' : 'POST';

        const token = getToken();
        const storedCompanyId =
          typeof window !== "undefined" ? localStorage.getItem("companyId")?.trim() ?? "" : "";

        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const numericBudget = parseFloat(budget.replace(/[^0-9.]/g, ""));
        const budgetPayload =
          budget.trim() && Number.isFinite(numericBudget) && numericBudget > 0 ? numericBudget : null;
        const descriptionForApi =
          trimmedDescription || "Details will be added soon.";

        const response = await fetch(endpoint, {
          method,
          headers,
          body: JSON.stringify({
            title: trimmedTitle,
            description: descriptionForApi,
            skills,
            budget: budgetPayload,
            // If we have a valid stored companyId, pass it; otherwise let the API
            // resolve from the authenticated founder's owned company.
            companyId: storedCompanyId || undefined,
            deadline: deadline.trim() || undefined,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setShowSuccess(true);
          // Ensure edited gig keeps the original id in UI state
          if (onSubmitGig) {
            onSubmitGig({
              ...result.data,
              id: result.data?.id ?? initialGig?.id,
            });
          }
        } else {
          alert("Error: " + result.error);
        }
      } catch (error) {
        console.error("Submission failed:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <Card className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl border-none relative overflow-hidden">
        <div className="max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-6rem)] overflow-y-auto p-6 md:p-10">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50" />
          
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-orange-600 transition-colors z-10">
            <X size={24} strokeWidth={3} />
          </button>

          <div className="mb-10 flex items-center gap-4 relative">
            <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-gray-950">Post a New <span className="text-orange-600">Gig</span></h2>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Hire the best campus talent</p>
              <p className="text-gray-500 font-semibold text-[11px] mt-2 max-w-md">
                Only the title is required. Budget, deadline, skills, and full description can be added later when you edit the gig.
              </p>
            </div>
          </div>

          <form className="space-y-6 relative" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Gig Title (required)</label>
              <Input
                placeholder="e.g. React Developer for E-commerce Site"
                className="rounded-2xl border-gray-100 bg-gray-50/50 py-7 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600 ml-1">Budget (LKR) — optional</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="10,000"
                    className="rounded-2xl border-gray-100 bg-gray-50/50 py-7 pl-12 font-bold text-gray-700"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
                {errors.budget && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.budget}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600 ml-1">Expected Deadline — optional</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="date"
                    min={minDate}
                    className="rounded-2xl border-gray-100 bg-gray-50/50 py-7 pl-12 font-bold text-gray-700"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                {errors.deadline && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.deadline}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Skills — optional</label>
              <div className="relative">
                <Input
                  placeholder="e.g. React, TypeScript"
                  className="rounded-2xl border-gray-100 bg-gray-50/50 py-7 pr-14 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-blue-700 text-white p-2 hover:bg-blue-800 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Gig Description — optional</label>
              <Textarea
                placeholder="Tell students what you need (can add later)…"
                className="rounded-2xl border-gray-100 bg-gray-50/50 font-bold min-h-[140px] pt-5 text-gray-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.description}</p>}
            </div>

            <div className="pt-4 flex gap-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-6 rounded-2xl font-black transition-all"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-6 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Publish Opportunity"}
              </Button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-8 max-w-sm w-full text-center border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gig Published!</h3>
              <p className="text-sm text-gray-600 mb-6">Your opportunity is now live for all students to see.</p>
              <Button
                type="button"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl"
                onClick={() => { setShowSuccess(false); onClose(); }}
              >
                Great!
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};