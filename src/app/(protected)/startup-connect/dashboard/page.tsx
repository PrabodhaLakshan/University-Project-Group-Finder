"use client";

import { StartupDashboardView } from "@/modules/startup-connect/components/StartupDashboardView";
import { useStartupProfile } from "@/modules/startup-connect/context/StartupProfileContext";

export default function StartupDashboardPage() {
  const { profile } = useStartupProfile();

  const fallbackData = {
    name: "Founder",
    industry: "General",
    about: "Your startup mission will appear here once you post your first gig.",
  };

  return <StartupDashboardView data={profile ?? fallbackData} />;
}
