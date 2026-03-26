import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <Card className="rounded-3xl border-dashed border-[#E5E7EB] bg-white">
      <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
        <div className="rounded-2xl bg-[#EEF4FF] p-4 text-[#3B5BDB]">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#111827]">{title}</h3>
          <p className="max-w-md text-sm leading-6 text-[#6B7280]">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
