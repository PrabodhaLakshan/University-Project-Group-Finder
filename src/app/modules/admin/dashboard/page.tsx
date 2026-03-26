import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AdminTable } from "../components/AdminTable";
import { QuickActionCard } from "../components/QuickActionCard";
import { RecentActivity } from "../components/RecentActivity";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { SummaryCard } from "../components/SummaryCard";
import { dashboardMetrics, pendingReports, pendingVerifications, quickActions, recentActivities } from "../utils/mock-data";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Overview"
        title="Trust, growth, and platform operations"
        description="Track adoption across Uni Mart, Startup Finder, Project Group Finder, and Tutor Connect from one responsive admin workspace."
        action={
          <Button className="h-11 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] px-5 text-white hover:opacity-95">
            Export snapshot
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <SummaryCard key={metric.title} {...metric} />
        ))}
      </section>

      

      
    </div>
  );
}
