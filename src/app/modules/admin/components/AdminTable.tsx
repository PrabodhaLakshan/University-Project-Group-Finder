import { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type AdminTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  className?: string;
};

export function AdminTable<T>({ data, columns, emptyMessage = "No records found.", className }: AdminTableProps<T>) {
  return (
    <Card className={cn("overflow-hidden rounded-3xl border-[#E5E7EB] shadow-[0_18px_40px_rgba(15,23,42,0.04)]", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E7EB] text-left">
          <thead className="bg-[#F8FAFC]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]",
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] bg-white">
            {data.length ? (
              data.map((row, index) => (
                <tr key={index} className="align-top transition-colors hover:bg-[#FAFBFF]">
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-5 py-4 text-sm text-[#111827]", column.className)}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center text-sm text-[#6B7280]">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
