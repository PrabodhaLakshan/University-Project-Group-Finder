"use client";

import React, { useState } from 'react';
// Components ටික නිවැරදි Path එකෙන් Import කරගන්න
import { StartupUI } from "@/modules/startup-connect/components/StartupUI"; 
import { StartupRegisterForm } from "@/modules/startup-connect/components/StartupRegisterForm";
import { StartupDashboardView } from "@/modules/startup-connect/components/StartupDashboardView";

export default function StartupConnectPage() {
  
  const [currentView, setCurrentView] = useState<'landing' | 'register' | 'dashboard'>('landing');
  
 
  const [startupData, setStartupData] = useState({
    name: '',
    industry: '',
    about: ''
  });

  
  const goToRegister = () => setCurrentView('register');
  const goToDashboard = () => setCurrentView('dashboard');

  // 2. Register Form එක Submit කරාම Dashboard එකට යවන function එක
  const finishRegistration = (data: any) => {
    setStartupData(data); // Data ටික Save කරගන්නවා
    setCurrentView('dashboard'); // Dashboard එකට මාරු කරනවා
  };

  return (
    <main className="min-h-screen bg-white">
      {/* දැනට තියෙන View එක අනුව Component එක පෙන්වනවා */}
      
      {currentView === 'landing' && (
        <StartupUI onPostGigClick={goToRegister} />
      )}

      {currentView === 'register' && (
        <StartupRegisterForm onComplete={finishRegistration} onAlreadyHaveAccount={goToDashboard} />
      )}

      {currentView === 'dashboard' && (
        <StartupDashboardView data={startupData} />
      )}
    </main>
  );
}
