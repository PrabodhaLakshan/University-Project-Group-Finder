import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ActivityItem } from "../types";
import { StatusBadge } from "./StatusBadge";

type RecentActivityProps = {
  items: ActivityItem[];
  title?: string;
  description?: string;
};

export function RecentActivity({
  items,
  title = "Recent activity",
  description = "Latest moderation and operational events across the platform.",
}: RecentActivityProps) {
  return (
    <Card className="rounded-3xl border-[#E5E7EB] shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg text-[#111827]">{title}</CardTitle>
        <p className="text-sm text-[#6B7280]">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-[#111827]">{item.title}</p>
                <p className="text-sm leading-6 text-[#6B7280]">{item.description}</p>
              </div>
              {item.status ? <StatusBadge status={item.status} /> : null}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[#6B7280]">{item.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
