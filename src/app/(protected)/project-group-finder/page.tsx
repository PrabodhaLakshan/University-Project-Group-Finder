"use client";

import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Navbar from "@/components/Navbar";
import GroupFinderUI from "@/app/modules/project-group-finder/components/GroupFinderUI";

export default function ProjectGroupFinderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <GroupFinderUI user={user} />
    </div>
  );
}

