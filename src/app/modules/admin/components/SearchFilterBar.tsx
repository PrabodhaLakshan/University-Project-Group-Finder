import { ReactNode } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { FilterOption } from "../types";

type SearchFilterBarProps = {
  placeholder?: string;
  filters?: {
    label: string;
    options: FilterOption[];
  }[];
  action?: ReactNode;
  className?: string;
};

export function SearchFilterBar({
  placeholder = "Search",
  filters = [],
  action,
  className,
}: SearchFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <Input
            placeholder={placeholder}
            className="h-11 rounded-2xl border-[#E5E7EB] bg-[#F8FAFC] pl-11 text-[#111827] placeholder:text-[#6B7280] focus-visible:ring-[#4A90E2]/30"
          />
        </div>
        {filters.map((filter) => (
          <label
            key={filter.label}
            className="flex h-11 min-w-[180px] items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm text-[#6B7280]"
          >
            <Filter className="h-4 w-4 shrink-0 text-[#3B5BDB]" />
            <select className="w-full bg-transparent text-[#111827] outline-none">
              <option>{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 text-sm font-medium text-[#6B7280]">
          <SlidersHorizontal className="h-4 w-4 text-[#3B5BDB]" />
          Filters
        </div>
        {action}
      </div>
    </div>
  );
}
