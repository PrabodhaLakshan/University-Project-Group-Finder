"use client";
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, ArrowRight } from "lucide-react";

export const StartupRegisterForm = ({
  onComplete,
  onAlreadyHaveAccount,
}: {
  onComplete: (data: any) => void;
  onAlreadyHaveAccount?: () => void;
}) => {
  const REGISTERED_COMPANIES_KEY = "registered_startup_companies";
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const allowedCertificateTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    about: '',
    logo: null as File | null,
    certificates: [] as File[],
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleCertificatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setFormData((prev) => ({ ...prev, certificates: files }));
  };

  const normalizeCompanyValue = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

  const handleSubmit = () => {
    const trimmedName = formData.name.trim();
    const trimmedIndustry = formData.industry.trim();
    const trimmedAbout = formData.about.trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError("Startup name must be between 2 and 80 characters.");
      return;
    }

    if (trimmedIndustry.length < 2 || trimmedIndustry.length > 60) {
      setError("Industry must be between 2 and 60 characters.");
      return;
    }

    if (trimmedAbout.length < 20 || trimmedAbout.length > 500) {
      setError("Short pitch must be between 20 and 500 characters.");
      return;
    }

    const normalizedName = normalizeCompanyValue(trimmedName);
    const normalizedIndustry = normalizeCompanyValue(trimmedIndustry);

    try {
      const existingCompaniesRaw = localStorage.getItem(REGISTERED_COMPANIES_KEY);
      const existingCompanies: Array<{ name: string; industry: string }> = existingCompaniesRaw
        ? JSON.parse(existingCompaniesRaw)
        : [];

      const alreadyExists = existingCompanies.some(
        (company) =>
          normalizeCompanyValue(company.name) === normalizedName &&
          normalizeCompanyValue(company.industry) === normalizedIndustry
      );

      if (alreadyExists) {
        setError("This company is already registered with the same details.");
        return;
      }
    } catch {
      setError("Unable to validate existing company records. Please try again.");
      return;
    }

    if (!formData.logo) {
      setError("Business logo is required.");
      return;
    }

    if (formData.logo.size > MAX_FILE_SIZE) {
      setError("Business logo must be 5MB or smaller.");
      return;
    }

    const invalidCertificate = formData.certificates.find(
      (file) => !allowedCertificateTypes.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidCertificate) {
      setError("Certificates must be PDF/JPG/PNG/WEBP and each file must be 5MB or smaller.");
      return;
    }

    try {
      const existingCompaniesRaw = localStorage.getItem(REGISTERED_COMPANIES_KEY);
      const existingCompanies: Array<{ name: string; industry: string }> = existingCompaniesRaw
        ? JSON.parse(existingCompaniesRaw)
        : [];

      const updatedCompanies = [
        ...existingCompanies,
        { name: trimmedName, industry: trimmedIndustry },
      ];
      localStorage.setItem(REGISTERED_COMPANIES_KEY, JSON.stringify(updatedCompanies));
    } catch {
      setError("Unable to save company registration details. Please try again.");
      return;
    }

    setError(null);
    onComplete(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <Card className="max-w-lg w-full border-none shadow-2xl shadow-blue-100/20 p-8 rounded-[40px]">
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Rocket className="text-orange-600 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Set up Startup</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Founders access only</p>
        </div>
        
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Startup Name</label>
            <Input 
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-6 font-bold" 
              placeholder="e.g. Nexus Lab"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Industry</label>
            <Input 
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-6 font-bold" 
              placeholder="e.g. Fintech, Edtech"
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Short Pitch</label>
            <Textarea 
              className="rounded-2xl border-gray-100 bg-gray-50/50 font-bold min-h-25"
              placeholder="Tell us about your mission..."
              onChange={(e) => setFormData({...formData, about: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Business Logo</label>
            <Input
              type="file"
              accept="image/*"
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-2.5 font-bold file:mr-3 file:rounded-xl file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:text-[10px] file:font-black file:uppercase file:text-blue-700 hover:file:bg-blue-200"
              onChange={handleLogoChange}
            />
            {formData.logo && (
              <p className="text-[10px] font-bold text-slate-500">Selected: {formData.logo.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-700 ml-1">Business Certificates (Optional)</label>
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="rounded-2xl border-gray-100 bg-gray-50/50 py-2.5 font-bold file:mr-3 file:rounded-xl file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-[10px] file:font-black file:uppercase file:text-orange-700 hover:file:bg-orange-200"
              onChange={handleCertificatesChange}
            />
            {formData.certificates.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500">{formData.certificates.length} file(s) selected</p>
                <ul className="text-[10px] font-medium text-slate-500 list-disc ml-4">
                  {formData.certificates.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-8 rounded-2xl font-black text-lg group"
          >
            Register my Company <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onAlreadyHaveAccount}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-8 rounded-2xl font-black text-lg group"
          >
            Already Registered my company
          </Button>
        </div>
      </Card>
    </div>
  );
};