"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, DollarSign, Calendar, Zap, Plus } from "lucide-react";

export interface GigFormValues {
  id?: number;
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
  onSubmitGig?: (gig: GigFormValues) => void;
}

export const PostGigModal = ({ isOpen, onClose, initialGig, onSubmitGig }: PostGigModalProps) => {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Pre-fill or reset when opening
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // 1. Title Validation
    if (!trimmedTitle) {
      newErrors.title = "Gig title is required.";
    } else if (trimmedTitle.length > 100) {
      newErrors.title = "Title is too long (Max 100 chars).";
    }

    // 2. Budget Validation
    const numericBudget = parseFloat(budget.replace(/[^0-9.]/g, ""));
    if (!budget.trim()) {
      newErrors.budget = "Budget is required.";
    } else if (isNaN(numericBudget) || numericBudget <= 0) {
      newErrors.budget = "Please enter a valid positive amount.";
    }

    // 3. Deadline Validation
    if (!deadline) {
      newErrors.deadline = "Expected deadline is required.";
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.deadline = "Deadline cannot be in the past.";
      }
    }

    // 4. Description Validation
    if (!trimmedDescription) {
      newErrors.description = "Description is required.";
    } else if (trimmedDescription.length < 20) {
      newErrors.description = "Please provide at least 20 characters.";
    } else if (trimmedDescription.length > 1000) {
      newErrors.description = "Description is too long (Max 1000 chars).";
    }

    // 5. Skills Validation
    if (!skills.length) {
      newErrors.skills = "Please add at least one required skill.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload: GigFormValues = {
        id: initialGig?.id,
        title: trimmedTitle,
        budget,
        deadline,
        description: trimmedDescription,
        skills,
      };

      if (onSubmitGig) {
        onSubmitGig(payload);
      }

      setShowSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <Card className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl border-none relative overflow-hidden">
        <div className="max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-6rem)] overflow-y-auto p-6 md:p-10">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50" />

          {/* Close Button */}
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
            </div>
          </div>

          <form className="space-y-6 relative" onSubmit={handleSubmit}>
          {/* Gig Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Gig Title</label>
            <Input
              placeholder="e.g. React Developer for E-commerce Site"
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-7 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-orange-600 ml-1">Budget (LKR)</label>
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

            {/* Deadline Input with min attribute */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-orange-600 ml-1">Expected Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="date"
                  min={minDate} // prevent select past dates
                  className="rounded-2xl border-gray-100 bg-gray-50/50 py-7 pl-12 font-bold text-gray-700"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              {errors.deadline && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.deadline}</p>}
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Required Skills</label>
            <div className="relative">
              <Input
                placeholder="e.g. React, TypeScript"
                className="rounded-2xl border-gray-100 bg-gray-50/50 py-7 pr-14 font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-blue-700 text-white p-2 hover:bg-blue-800 transition-colors active:scale-95 flex items-center justify-center"
                aria-label="Add skill"
              >
                <Plus size={16} />
              </button>
            </div>
            {errors.skills && (
              <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.skills}</p>
            )}

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-orange-200 focus:outline-none"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Gig Description</label>
            <Textarea
              placeholder="Tell students what you need..."
              className="rounded-2xl border-gray-100 bg-gray-50/50 font-bold min-h-35 pt-5 text-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p className="text-xs font-semibold text-red-500 mt-1 ml-1">{errors.description}</p>}
          </div>

            {/* Buttons */}
            <div className="pt-4 flex gap-4">
               <Button
                 type="button"
                 onClick={onClose}
                 className="flex-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-sm md:text-base transition-all active:scale-95 border-none"
               >
                 Cancel
               </Button>
               <Button
                 type="submit"
                 className="flex-0.5 bg-blue-700 hover:bg-blue-800 text-white py-4 md:py-6 rounded-xl font-black text-sm md:text-base shadow-xl shadow-blue-100 transition-all active:scale-95"
               >
                 Publish Opportunity
               </Button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-5 max-w-sm w-full text-center border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Gig Published</h3>
              <p className="text-sm text-gray-600 mb-4">Your opportunity has been published successfully.</p>
              <Button
                type="button"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl"
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
              >
                OK
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};