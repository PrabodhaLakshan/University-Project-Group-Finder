"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function RegisterCheckPage() {
  const router = useRouter();

  useEffect(() => {
    const checkTutorStatus = async () => {
      try {
        const token = getToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch("/api/tutor-connect/tutors/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.replace("/tutor-connect/register");
          return;
        }

        const data = await res.json();

        if (data.isTutor) {
          router.replace("/tutor-connect/dashboard");
        } else {
          router.replace("/tutor-connect/register");
        }
      } catch (error) {
        console.error("Register check error:", error);
        router.replace("/tutor-connect/register");
      }
    };

    checkTutorStatus();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-600 text-lg font-medium">Checking tutor status...</p>
    </div>
  );
}