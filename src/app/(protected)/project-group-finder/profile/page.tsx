"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import ProfilePage from "@/app/modules/project-group-finder/components/profile/Profilepage";
import LeftSidebar, { NavKey } from "@/app/modules/project-group-finder/components/LeftSidebar";

type Panel = NavKey;

export default function ProfilePageRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navbar */}
      <Navbar />

      {/* Fixed left sidebar — same as GroupFinderUI */}
      <LeftSidebar
        active={panel}
        onChange={setPanel}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="lg:pl-[260px]">
        <ProfilePage />
      </div>
    </div>
  );
}