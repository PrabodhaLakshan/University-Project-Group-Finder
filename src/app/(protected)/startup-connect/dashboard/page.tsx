import { StartupDashboardView } from "@/modules/startup-connect/components/StartupDashboardView";

export default function StartupDashboardPage() {
  const startupData = {
    name: "Founder",
    industry: "General",
    about: "Your startup mission will appear here once you post your first gig.",
  };

  return <StartupDashboardView data={startupData} />;
}
