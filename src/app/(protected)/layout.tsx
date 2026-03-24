"use client";

import { Navbar } from "@/app/modules/startup-connect/components/Navbar";
import { usePathname } from "next/navigation";
import { StartupProfileProvider } from "@/app/modules/startup-connect/context/StartupProfileContext";

export default function StartupConnectLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStartupConnectPage = pathname.includes('/startup-connect') ||
                               pathname.includes('/dashboard/student') ||
                               pathname.includes('/dashboard/startup');

  return (
    <StartupProfileProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className={`grow ${isStartupConnectPage ? 'pt-16 md:pt-0 md:pl-72' : ''}`}>
          {children}
        </main>
      </div>
    </StartupProfileProvider>
  );
  
}
