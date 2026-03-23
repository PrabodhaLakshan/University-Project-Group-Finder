"use client";

import { Navbar } from "@/modules/startup-connect/components/Navbar";
import { Footer } from "@/modules/startup-connect/components/Footer";
import { usePathname } from "next/navigation";

export default function StartupConnectLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStartupConnectPage = pathname.includes('/startup-connect') ||
                               pathname.includes('/dashboard/student') ||
                               pathname.includes('/dashboard/startup');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className={`grow ${isStartupConnectPage ? 'pt-16 md:pt-0 md:pl-72' : ''}`}>
        {children}
      </main>
      <div className={isStartupConnectPage ? 'md:pl-72' : ''}>
        <Footer />
      </div>
    </div>
  );
  
}
