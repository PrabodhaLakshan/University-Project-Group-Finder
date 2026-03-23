import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
};

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div className="h-full w-full flex-1 bg-blue-600 transition-all" style={{ transform: `translateX(-${100 - clampedValue}%)` }} />
    </div>
  );
}
