"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarRange, PlusCircle, BookOpenCheck, Users, MessageSquareQuote, GraduationCap } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/tutor-connect/dashboard", icon: LayoutDashboard },
  { name: "Slots", href: "/tutor-connect/slots", icon: CalendarRange },
  { name: "Create Slot", href: "/tutor-connect/create-slot", icon: PlusCircle },
  { name: "Bookings", href: "/tutor-connect/bookings", icon: BookOpenCheck },
  { name: "Waitlist", href: "/tutor-connect/waitlist", icon: Users },
  { name: "Feedback", href: "/tutor-connect/feedback", icon: MessageSquareQuote },
];

export default function TutorSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[280px] h-screen bg-white border-r border-slate-100 flex flex-col pt-8 pb-6 px-5 relative z-20">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-[12px] shadow-sm">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-[22px] font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Tutor Connect
        </h2>
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
                  ? "bg-blue-50/80 text-blue-600 font-bold shadow-sm border border-blue-100/50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium border border-transparent"
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgb(59,130,246,0.6)]" />
              )}
              
              <Icon 
                className={`w-[20px] h-[20px] transition-colors ${
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
                }`} 
              />
              <span className="tracking-wide text-[14.5px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile Area (Placeholder for modern UI) */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-3 rounded-[16px] hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-slate-200/50 shadow-sm shrink-0">
            TJ
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold text-slate-800 truncate">Tutor Jane</h3>
            <p className="text-[12px] font-medium text-slate-400 truncate">Pro Instructor</p>
          </div>
        </div>
      </div>
    </div>
  );
}