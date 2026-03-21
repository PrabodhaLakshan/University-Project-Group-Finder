"use client";

import Navbar from "@/components/Navbar";
import Groupcard from "@/components/ProjectGroupFinderCard";
import Allcard from "@/components/cards";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-gray-700">
          Hi <span className="font-medium">{user.name}</span> 👋
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="mt-1 font-semibold">{user.student_id}</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 font-semibold">{user.email}</p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-gray-500">Next step</p>
            <p className="mt-1 font-semibold">Create your profile & skills</p>
          </div>
        </div>
      </main>
      
      <Allcard/>
    </div>
  );
}
