"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpenCheck,
  GraduationCap,
  Star,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/tutor-connect/student-dashboard", icon: LayoutDashboard },
  { name: "My Bookings", href: "/tutor-connect/student-bookings", icon: BookOpenCheck },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[280px] h-screen bg-white border-r border-slate-100 flex flex-col pt-8 pb-6 px-5 relative z-20">

      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 mb-10">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-[12px] shadow-sm">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-[22px] font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Tutor Connect
        </h2>
      </div>

      {/* Role Badge */}
      <div className="mx-3 mb-6 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-[12px] flex items-center gap-2">
        <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
        <span className="text-[13px] font-bold text-emerald-700 tracking-wide">Student Portal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-[14px] transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? "bg-emerald-50/80 text-emerald-700 font-bold shadow-sm border border-emerald-100/50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium border border-transparent"
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgb(16,185,129,0.6)]" />
              )}

              <Icon
                className={`w-[20px] h-[20px] transition-colors ${
                  isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"
                }`}
              />
              <span className="tracking-wide text-[14.5px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile Area */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-[16px] hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200/50 shadow-sm shrink-0">
            ST
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold text-slate-800 truncate">Student User</h3>
            <p className="text-[12px] font-medium text-slate-400 truncate">Learner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
