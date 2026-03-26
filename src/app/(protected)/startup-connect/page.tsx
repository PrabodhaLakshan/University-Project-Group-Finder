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
    setProfile({
      name: data?.name || '',
      industry: data?.industry || '',
      about: data?.about || '',
      logo: data?.logo ?? null,
      certificates: Array.isArray(data?.certificates) ? data.certificates : [],
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
