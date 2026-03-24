"use client";
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, ArrowRight, UploadCloud, Building2, Briefcase, FileCheck, ShieldCheck, Loader2 } from "lucide-react";

export const StartupRegisterForm = ({
  onComplete,
  onAlreadyHaveAccount,
}: {
  onComplete: (data: any) => void;
  onAlreadyHaveAccount?: () => void;
}) => {
  const MAX_NAME_LENGTH = 60;
  const MAX_ABOUT_LENGTH = 400;

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    about: '',
    logo: null as File | null,
    certificates: [] as File[],
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    industry?: string;
    about?: string;
    logo?: string;
    certificates?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > MAX_NAME_LENGTH) return;
    setFormData((prev) => ({ ...prev, name: value }));
    setFieldErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, industry: value }));
    setFieldErrors((prev) => ({ ...prev, industry: undefined }));
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_ABOUT_LENGTH) return;
    setFormData((prev) => ({ ...prev, about: value }));
    setFieldErrors((prev) => ({ ...prev, about: undefined }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setFormData((prev) => ({ ...prev, logo: null }));
      return;
    }

    const isValidType =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";
    const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB

    if (!isValidType || !isValidSize) {
      setFieldErrors((prev) => ({
        ...prev,
        logo: !isValidType
          ? "Logo must be PNG or JPG."
          : "Logo must be smaller than 2MB.",
      }));
      setFormData((prev) => ({ ...prev, logo: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, logo: file }));
    setFieldErrors((prev) => ({ ...prev, logo: undefined }));
  };

  const handleCertificatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) {
      setFormData((prev) => ({ ...prev, certificates: [] }));
      return;
    }

    const files = Array.from(fileList);
    const validFiles: File[] = [];
    let hasInvalid = false;

    files.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      if (isImage && isValidSize) {
        validFiles.push(file);
      } else {
        hasInvalid = true;
      }
    });

    setFormData((prev) => ({ ...prev, certificates: validFiles }));

    setFieldErrors((prev) => ({
      ...prev,
      certificates: hasInvalid
        ? "Some files were ignored. Certificates must be images under 5MB."
        : undefined,
    }));
  };

  const handleSubmit = async () => {
    const newErrors: {
      name?: string;
      industry?: string;
      about?: string;
      logo?: string;
      certificates?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Startup name is required.";
    }

    if (formData.name.trim().length > MAX_NAME_LENGTH) {
      newErrors.name = `Startup name must be under ${MAX_NAME_LENGTH} characters.`;
    }

    if (!formData.industry) {
      newErrors.industry = "Please select an industry.";
    }

    if (!formData.about.trim()) {
      newErrors.about = "Elevator pitch is required.";
    } else if (formData.about.trim().length > MAX_ABOUT_LENGTH) {
      newErrors.about = `Elevator pitch must be under ${MAX_ABOUT_LENGTH} characters.`;
    }

    if (!formData.logo) {
      newErrors.logo = "Business logo is required.";
    }

    const hasErrors = Object.values(newErrors).some(Boolean);

    if (hasErrors) {
      setFieldErrors(newErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setError(null);

    try {
      setIsSubmitting(true);
      await Promise.resolve(onComplete(formData));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 md:p-10 font-sans">
      {/* --- Main Large Card --- */}
      <Card className="max-w-5xl w-full border-none shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] bg-white rounded-[2.5rem] overflow-hidden p-3 md:p-6">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- LEFT SIDE: Venture Profile (Details) --- */}
          <div className="flex-1 flex flex-col justify-between py-2 md:pl-4 order-2 md:order-1">
            <div className="space-y-6">
              
              {/* --- HEADER: Blue BG with Black Text --- */}
              <div className="bg-blue-100 rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm border border-blue-200">
                <div className="space-y-1">
                   <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                    <div className="w-2 h-6 bg-blue-600 rounded-full" /> Venture Profile
                  </h2>
                  <p className="text-[9px] font-bold text-blue-700 uppercase tracking-[0.3em] ml-5">Primary Identity Details</p>
                </div>
                <span className="hidden md:block bg-blue-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase shadow-md shadow-blue-200">Step 01/01</span>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-[10px] font-bold text-red-600 text-center border border-red-100 italic">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest">
                    <Building2 size={12} className="text-blue-500" /> Startup Name
                  </label>
                  <Input 
                    className={`rounded-2xl border-slate-100 bg-slate-50/50 h-12 font-bold focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all ${fieldErrors.name ? 'border-red-400 ring-red-100 focus:ring-red-200' : ''}`} 
                    placeholder="Nexus Lab"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                  {fieldErrors.name && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest">
                    <Briefcase size={12} className="text-blue-500" /> Industry Sector
                  </label>
                  <select
                    className={`rounded-2xl border-slate-100 bg-slate-50/50 h-12 font-bold text-[13px] px-3 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all w-full appearance-none ${fieldErrors.industry ? 'border-red-400 ring-red-100 focus:ring-red-200' : ''}`}
                    value={formData.industry}
                    onChange={handleIndustryChange}
                  >
                    <option value="" disabled>
                      Select industry
                    </option>
                    <option value="AI">AI</option>
                    <option value="IT">IT</option>
                    <option value="DS">DS</option>
                    <option value="Multimedia">Multimedia</option>
                  </select>
                  {fieldErrors.industry && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{fieldErrors.industry}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2 tracking-widest">
                    <FileCheck size={12} className="text-blue-500" /> Elevator Pitch
                  </label>
                  <Textarea 
                    className={`rounded-[2rem] border-slate-100 bg-slate-50/50 font-bold min-h-35 resize-none focus:bg-white p-6 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner ${fieldErrors.about ? 'border-red-400 ring-red-100 focus:ring-red-200' : ''}`}
                    placeholder="Briefly describe what your startup does and its core mission..."
                    value={formData.about}
                    onChange={handleAboutChange}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {fieldErrors.about && (
                      <p className="text-[10px] font-bold text-red-500 ml-1">{fieldErrors.about}</p>
                    )}
                    <span className="ml-auto text-[10px] font-bold text-slate-400">
                      {formData.about.length}/{MAX_ABOUT_LENGTH}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- COMPACT BUTTONS --- */}
            <div className="flex items-center justify-start gap-4 mt-10">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-fit px-8 bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-2xl font-black text-[10px] shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    Register <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                onClick={onAlreadyHaveAccount}
                disabled={isSubmitting}
                className="w-fit px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Login
              </Button>
            </div>
          </div>

          {/* --- RIGHT SIDE: Media Assets Sub-Card --- */}
          <div className="w-full md:w-1/3 bg-slate-50/80 rounded-[2rem] p-6 border border-slate-100 flex flex-col justify-center space-y-8 order-1 md:order-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Media Assets</h3>
              <p className="text-[9px] font-bold text-slate-400">UPLOAD BRANDING & DOCUMENTS</p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-700/70 ml-1 flex items-center gap-2">
                <UploadCloud size={12} /> Business Logo
              </label>
              <label className={`relative h-36 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${fieldErrors.logo ? 'border-red-400 bg-red-50/40' : formData.logo ? 'bg-white border-blue-400 shadow-sm' : 'bg-white/50 border-slate-200 hover:border-blue-300'}`}>
                <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoChange} />
                {formData.logo ? (
                  <div className="text-center px-4">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2 font-bold text-blue-600 italic">OK</div>
                    <span className="text-[9px] font-bold text-slate-600 truncate block w-full">{formData.logo.name}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadCloud className="text-slate-300 w-6 h-6 mx-auto mb-1" />
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Click to select logo</span>
                  </div>
                )}
              </label>
              {fieldErrors.logo && (
                <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{fieldErrors.logo}</p>
              )}
            </div>

            {/* Verification Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-700/70 ml-1 flex items-center gap-2">
                <ShieldCheck size={12} /> Certifications
              </label>
              <label className={`relative h-36 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${fieldErrors.certificates ? 'border-red-400 bg-red-50/40' : formData.certificates.length > 0 ? 'bg-white border-orange-400 shadow-sm' : 'bg-white/50 border-slate-200 hover:border-orange-300'}`}>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleCertificatesChange} />
                {formData.certificates.length > 0 ? (
                  <div className="text-center">
                     <FileCheck className="text-orange-500 w-6 h-6 mx-auto mb-2" />
                     <span className="text-[9px] font-bold text-slate-600">{formData.certificates.length} Files Attached</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <ShieldCheck className="text-slate-300 w-6 h-6 mx-auto mb-1" />
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Attach Certificates</span>
                  </div>
                )}
              </label>
              {fieldErrors.certificates && (
                <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{fieldErrors.certificates}</p>
              )}
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
};