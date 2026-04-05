"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Components ටික නිවැරදි Path එකෙන් Import කරගන්න
import { StartupUI } from "@/app/modules/startup-connect/components/StartupUI"; 
import { StartupRegisterForm } from "@/app/modules/startup-connect/components/StartupRegisterForm";
import { useStartupProfile } from "@/app/modules/startup-connect/context/StartupProfileContext";

export default function StartupConnectPage() {
  const router = useRouter();
  const { setProfile } = useStartupProfile();
  
  const [currentView, setCurrentView] = useState<'landing' | 'register'>('landing');

  
  const goToRegister = () => setCurrentView('register');
  const goToDashboard = () => router.push('/startup-connect/dashboard');

 
  const finishRegistration = (data: any) => {
    try {
      const id = typeof data?.id === "string" ? data.id.trim() : "";
      if (id) {
        localStorage.setItem("companyId", id);
      }
    } catch {
      /* ignore */
    }
    setProfile({
      name: data?.name || '',
      industry: data?.industry || '',
      about: data?.about || '',
      // Prefer any direct logo field, otherwise use logo_url from the backend
      logo: data?.logo ?? data?.logo_url ?? null,
      // Support both array-style certificates and single certificate_url from the backend
      certificates: Array.isArray(data?.certificates)
        ? data.certificates
        : data?.certificate_url
        ? [data.certificate_url]
        : [],
    });
    router.push('/startup-connect/dashboard'); 
  };

  return (
    <main className="min-h-screen bg-white">
     
      
      {currentView === 'landing' && (
        <StartupUI onPostGigClick={goToRegister} />
      )}

      {currentView === 'register' && (
        <StartupRegisterForm onComplete={finishRegistration} onAlreadyHaveAccount={goToDashboard} />
      )}

    </main>
  );
}
