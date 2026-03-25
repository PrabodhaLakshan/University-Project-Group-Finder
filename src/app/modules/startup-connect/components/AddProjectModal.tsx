"use client";

import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Rocket, ImagePlus, X } from "lucide-react";

interface AddProjectModalProps {
  onAddProject: (project: any) => void;
}

type FormErrors = {
  title?: string;
  description?: string;
  github?: string;
  demo?: string;
  images?: string;
};

export const AddProjectModal = ({ onAddProject }: AddProjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const isValidHttpUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setGithub("");
    setDemo("");
    setSelectedImages([]);
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Project name is required";
    } else if (title.trim().length < 3) {
      nextErrors.title = "Project name must be at least 3 characters";
    }

    if (!desc.trim()) {
      nextErrors.description = "Project description is required";
    } else if (desc.trim().length < 20) {
      nextErrors.description = "Description must be at least 20 characters";
    }

    if (!demo.trim()) {
      nextErrors.demo = "Live demo link is required";
    } else if (!isValidHttpUrl(demo.trim())) {
      nextErrors.demo = "Enter a valid live demo URL (http/https)";
    }

    if (github.trim() && !isValidHttpUrl(github.trim())) {
      nextErrors.github = "Enter a valid GitHub URL (http/https)";
    }

    if (selectedImages.length > 5) {
      nextErrors.images = "You can upload up to 5 screenshots";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => prev.concat(filesArray).slice(0, 5));
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  const handlePublish = () => {
    if (!validateForm()) return;

    const newProject = {
      id: Date.now(),
      title: title.trim(),
      description: desc.trim(),
      github: github.trim(),
      demo: demo.trim(),
      date: "Feb 2026",
      images: selectedImages.length > 0 ? selectedImages : ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"]
    };

    onAddProject(newProject);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl px-6 py-6 font-black shadow-lg shadow-sky-100 flex items-center gap-2">
          <Plus className="w-5 h-5" /> NEW PROJECT
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-white rounded-[40px] border-none shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Rocket className="w-8 h-8 text-sky-600" /> ADD NEW PROJECT
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-6">
          <div>
            <Input
              placeholder="Project Name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className="rounded-2xl border-slate-100 py-6 font-bold"
            />
            {errors.title && <p className="mt-1 text-xs font-bold text-red-500">{errors.title}</p>}
          </div>

          <div>
            <Textarea
              placeholder="Project Description"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              className="rounded-2xl border-slate-100 font-bold"
            />
            {errors.description && <p className="mt-1 text-xs font-bold text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="GitHub Link"
                value={github}
                onChange={(e) => {
                  setGithub(e.target.value);
                  setErrors((prev) => ({ ...prev, github: undefined }));
                }}
                className="rounded-2xl border-slate-100 py-6 font-bold"
              />
              {errors.github && <p className="mt-1 text-xs font-bold text-red-500">{errors.github}</p>}
            </div>

            <div>
              <Input
                placeholder="Demo Link"
                value={demo}
                onChange={(e) => {
                  setDemo(e.target.value);
                  setErrors((prev) => ({ ...prev, demo: undefined }));
                }}
                className="rounded-2xl border-slate-100 py-6 font-bold"
              />
              {errors.demo && <p className="mt-1 text-xs font-bold text-red-500">{errors.demo}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-1">
              <ImagePlus className="w-4 h-4 text-sky-600" /> Screenshots
            </label>
            <div className="flex flex-wrap gap-3">
              {selectedImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-sky-50">
                  <img src={img} className="w-full h-full object-cover" alt={`screenshot-${i + 1}`} />
                  <X
                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer"
                    onClick={() => setSelectedImages(selectedImages.filter((_, idx) => idx !== i))}
                  />
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-sky-200 bg-sky-50 flex items-center justify-center cursor-pointer hover:bg-sky-100 transition-all">
                <Plus className="w-6 h-6 text-sky-400" />
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            {errors.images && <p className="text-xs font-bold text-red-500">{errors.images}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handlePublish} className="bg-sky-600 hover:bg-sky-700 text-white rounded-2xl w-full py-7 font-black text-lg">
            PUBLISH PROJECT
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};