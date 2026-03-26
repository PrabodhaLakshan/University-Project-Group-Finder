import { FolderKanban, UsersRound } from "lucide-react";

import { AdminTable } from "../components/AdminTable";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { SummaryCard } from "../components/SummaryCard";
import { groups } from "../utils/mock-data";

export default function AdminProjectGroupFinderPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Project Group Finder"
        title="Team formation and project oversight"
        description="Review group readiness, leadership, and proposal health across current academic projects."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Active groups" value="214" change="+18 this month" trend="up" icon={UsersRound} tone="blue" />
        <SummaryCard title="Pending matches" value="49" change="Students still unmatched" trend="neutral" icon={FolderKanban} tone="purple" />
        <SummaryCard title="Faculty reviews" value="17" change="Needs assignment" trend="neutral" icon={FolderKanban} tone="orange" />
        <SummaryCard title="Reported groups" value="6" change="-2 this week" trend="down" icon={UsersRound} tone="gold" />
      </section>

      <AdminTable
        data={groups}
        columns={[
          {
            key: "topic",
            header: "Topic",
            render: (row) => (
              <div className="space-y-1">
                <p className="font-semibold">{row.topic}</p>
                <p className="text-xs text-[#6B7280]">{row.stage}</p>
              </div>
            ),
          },
          { key: "leader", header: "Leader", render: (row) => row.leader },
          { key: "members", header: "Member count", render: (row) => row.memberCount },
          { key: "stage", header: "Stage", render: (row) => row.stage },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ]}
      />
    </div>
  );
}
