import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { AdminStatus } from "../types";
import { statusClassMap } from "../utils/admin-colors";

type StatusBadgeProps = {
  status: AdminStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        statusClassMap[status],
        className,
      )}
    >
      {status}
    </Badge>
  );
}
