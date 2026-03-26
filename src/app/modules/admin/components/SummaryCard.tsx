import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { SummaryMetric } from "../types";

const toneMap = {
  blue: "from-[#4A90E2] to-[#3B5BDB]",
  purple: "from-[#6C4CF1] to-[#3B5BDB]",
  orange: "from-[#F59E0B] to-[#F97316]",
  gold: "from-[#F97316] to-[#F59E0B]",
};

export function SummaryCard({ title, value, change, trend, icon: Icon, tone = "blue" }: SummaryMetric) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : ArrowRight;

  return (
    <Card className="overflow-hidden rounded-3xl border-[#E5E7EB] shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-4 p-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#6B7280]">{title}</p>
            <div className="space-y-1">
              <p className="text-3xl font-semibold tracking-tight text-[#111827]">{value}</p>
              <div
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                  trend === "down" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600",
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {change}
              </div>
            </div>
          </div>
          <div className={cn("rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
