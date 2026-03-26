import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6C4CF1]">{eyebrow}</p>
        ) : null}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">{title}</h2>
          {description ? <p className="max-w-2xl text-sm text-[#6B7280]">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
