"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Components ටික නිවැරදි Path එකෙන් Import කරගන්න
import { StartupUI } from "@/modules/startup-connect/components/StartupUI"; 
import { StartupRegisterForm } from "@/modules/startup-connect/components/StartupRegisterForm";

export default function StartupConnectPage() {
  const router = useRouter();
  
  const [currentView, setCurrentView] = useState<'landing' | 'register'>('landing');

  
  const goToRegister = () => setCurrentView('register');
  const goToDashboard = () => router.push('/startup-connect/dashboard');

 
  const finishRegistration = () => {
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
