"use client";

import { usePathname } from "next/navigation";
import TutorSidebar from "./TutorSidebar";
import StudentSidebar from "./StudentSidebar";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Standalone pages — no sidebar at all
  const isNoSidebarPage =
    pathname === "/tutor-connect" ||
    pathname?.startsWith("/tutor-connect/booking/");

  // Student portal pages — show StudentSidebar
  const isStudentPage =
    pathname === "/tutor-connect/student-dashboard" ||
    pathname === "/tutor-connect/student-bookings";

  if (isNoSidebarPage) {
    return <div className="bg-slate-50 min-h-screen">{children}</div>;
  }

  if (isStudentPage) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <StudentSidebar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  // Default: Tutor sidebar
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <TutorSidebar />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}