"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { adminNavItems } from "../utils/admin-nav";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.10)] transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        
          

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 shadow-sm">
            <div className="relative h-10 w-[170px]">
              <Image
                src="/images/navbar/UniNexus_nav_Logo_lightT.png"
                alt="UniNexus"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">Admin Panel</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Platform operations, moderation, and analytics in one place.</p>
          </div>
        

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1.5">
            {adminNavItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition",
                    active
                      ? "border-blue-200 bg-blue-50 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "rounded-xl p-2",
                        active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("truncate text-sm font-semibold", active ? "text-blue-700" : "text-slate-900")}>{item.title}</p>
                      <p className="truncate text-[11px] text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0", active ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400")} />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 px-4 py-5">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">Quick note</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Prioritize flagged listings and verification requests during peak campus traffic.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
