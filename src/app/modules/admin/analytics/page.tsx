import { BarChart3, LineChart, PieChart } from "lucide-react";

import { AdminTable } from "../components/AdminTable";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { SummaryCard } from "../components/SummaryCard";
import { dashboardMetrics, moduleUsageStats } from "../utils/mock-data";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Analytics"
        title="Module usage and platform performance"
        description="Prepared summary cards and chart placeholders so real metrics can be wired in later without reworking layout."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.slice(0, 4).map((metric) => (
          <SummaryCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)] xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#EEF4FF] p-3 text-[#3B5BDB]">
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#111827]">Growth trend</h3>
              <p className="text-sm text-[#6B7280]">Placeholder container for future time-series charts.</p>
            </div>
          </div>
          <div className="grid h-[280px] place-items-center rounded-[28px] border border-dashed border-[#D8E1F0] bg-[linear-gradient(135deg,rgba(74,144,226,0.08),rgba(108,76,241,0.08))] px-4">
            <EmptyState
              icon={BarChart3}
              title="Chart area ready"
              description="Attach analytics services or chart libraries later without changing the surrounding card layout."
            />
          </div>
        </div>
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#FFF7ED] p-3 text-[#F97316]">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#111827]">Engagement mix</h3>
              <p className="text-sm text-[#6B7280]">Module-level share of active traffic and conversion.</p>
            </div>
          </div>
          <div className="space-y-4">
            {moduleUsageStats.map((item) => (
              <div key={item.module} className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#111827]">{item.module}</p>
                  <p className="text-sm font-semibold text-[#3B5BDB]">{item.activeUsers}</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className="h-2 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#6C4CF1]" style={{ width: `${Math.min(parseFloat(item.conversion) * 4, 100)}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[#6B7280]">
                  <span>Conversion {item.conversion}</span>
                  <span>Satisfaction {item.satisfaction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdminTable
        data={moduleUsageStats}
        columns={[
          { key: "module", header: "Module", render: (row) => <span className="font-semibold">{row.module}</span> },
          { key: "activeUsers", header: "Active users", render: (row) => row.activeUsers },
          { key: "conversion", header: "Conversion", render: (row) => row.conversion },
          { key: "satisfaction", header: "Satisfaction", render: (row) => row.satisfaction },
        ]}
      />
    </div>
  );
}
