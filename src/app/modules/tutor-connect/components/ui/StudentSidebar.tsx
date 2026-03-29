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
    <div className="sticky top-0 self-start w-[280px] h-screen bg-white border-r border-slate-100 flex flex-col pt-8 pb-6 px-6 relative z-20">
      
      {/* Brand Logo - Updated to BLUE */}
      <div className="flex items-center gap-3 px-2 mb-12 group cursor-pointer">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">
          Tutor<span className="text-blue-600">Connect</span>
        </h2>
      </div>

      {/* Role Badge - Updated to BLUE */}
      <div className="mb-8 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Student Portal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-200 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-600 font-semibold"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? "text-white scale-110" : "text-slate-400 group-hover:scale-110 group-hover:text-blue-500"
                }`}
              />
              <span className="text-[15px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Area - Updated to BLUE */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-black border border-blue-200 shadow-sm group-hover:scale-105 transition-transform">
            ST
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-800 truncate">Student User</h3>
            <p className="text-[11px] font-black text-blue-500 uppercase tracking-tighter">Premium Learner</p>
          </div>
        </div>
      </div>
    </div>
  );
}