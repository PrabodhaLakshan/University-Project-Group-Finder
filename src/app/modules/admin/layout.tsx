"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminShell } from "./components/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin-login");
      return;
    }

    // Basic JWT expiry check (decode payload without verification - verification is on server)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        router.replace("/admin-login");
      }
    } catch {
      localStorage.removeItem("adminToken");
      router.replace("/admin-login");
    }
  }, [router]);

  return <AdminShell>{children}</AdminShell>;
}
