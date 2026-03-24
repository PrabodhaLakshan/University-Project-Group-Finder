"use client";

import React from "react";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export const DashboardLayout = ({ children, className, contentClassName }: DashboardLayoutProps) => {
  return (
    <main className={cn("min-h-screen bg-slate-50/70 pb-10 px-4 pt-6 md:px-8 md:pt-10", className)}>
      <div className={cn("max-w-6xl mx-auto", contentClassName)}>{children}</div>
    </main>
  );
};
