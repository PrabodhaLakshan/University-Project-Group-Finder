import { Building2, CheckCircle2 } from "lucide-react";

import { AdminTable } from "../components/AdminTable";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { SummaryCard } from "../components/SummaryCard";
import { dashboardMetrics, startupProfiles } from "../utils/mock-data";

export default function AdminStartupFinderPage() {
  const startupMetrics = [
    dashboardMetrics[2],
    { ...dashboardMetrics[1], title: "Open gigs", value: "39", change: "+11 this week", icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Startup Finder"
        title="Startup pipelines and verification health"
        description="Monitor founder onboarding, active gig volume, and trust signals before backend workflows are connected."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {startupMetrics.map((metric) => (
          <SummaryCard key={metric.title} {...metric} />
        ))}
        <SummaryCard
          title="Verified founders"
          value="82"
          change="59% of startup accounts"
          trend="up"
          icon={CheckCircle2}
          tone="purple"
        />
        <SummaryCard
          title="Profiles flagged"
          value="5"
          change="Document mismatch queue"
          trend="neutral"
          icon={Building2}
          tone="orange"
        />
      </section>

      <AdminTable
        data={startupProfiles}
        columns={[
          {
            key: "name",
            header: "Startup",
            render: (row) => (
              <div className="space-y-1">
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-[#6B7280]">Founder: {row.founder}</p>
              </div>
            ),
          },
          { key: "domain", header: "Domain", render: (row) => row.domain },
          { key: "gigs", header: "Open gigs", render: (row) => row.gigs },
          { key: "verification", header: "Verification", render: (row) => <StatusBadge status={row.verificationStatus} /> },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
      />
    </div>
  );
}
