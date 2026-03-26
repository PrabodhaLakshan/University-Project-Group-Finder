import { MessageSquareQuote, Users } from "lucide-react";

import { AdminTable } from "../components/AdminTable";
import { RecentActivity } from "../components/RecentActivity";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { SummaryCard } from "../components/SummaryCard";
import { bookingSummary, recentActivities, tutors } from "../utils/mock-data";

export default function AdminTutorConnectPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Tutor Connect"
        title="Tutors, bookings, and waitlists"
        description="Manage learning supply, booking throughput, and recent feedback trends from a single dashboard."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {bookingSummary.map((metric) => (
          <SummaryCard key={metric.title} {...metric} />
        ))}
        <SummaryCard title="Feedback flagged" value="9" change="Needs review" trend="neutral" icon={MessageSquareQuote} tone="gold" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <AdminTable
          data={tutors}
          columns={[
            {
              key: "name",
              header: "Tutor",
              render: (row) => (
                <div className="space-y-1">
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-xs text-[#6B7280]">{row.subject}</p>
                </div>
              ),
            },
            { key: "subject", header: "Subject", render: (row) => row.subject },
            { key: "rating", header: "Rating", render: (row) => row.rating },
            { key: "bookings", header: "Bookings", render: (row) => row.bookings },
            { key: "waitlist", header: "Waitlist", render: (row) => row.waitlist },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
        />
        <div className="space-y-6">
          <RecentActivity
            items={recentActivities.slice(0, 3)}
            title="Feedback preview"
            description="Recent quality, attendance, and student experience signals."
          />
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#EEF4FF] p-3 text-[#3B5BDB]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111827]">Waitlist summary</h3>
                <p className="text-sm text-[#6B7280]">Peak demand remains in Calculus and Java Programming.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Open requests</p>
                <p className="mt-2 text-2xl font-semibold text-[#111827]">74</p>
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">Avg response</p>
                <p className="mt-2 text-2xl font-semibold text-[#111827]">3.2h</p>
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6B7280]">SLA risk</p>
                <p className="mt-2 text-2xl font-semibold text-[#F97316]">11</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
