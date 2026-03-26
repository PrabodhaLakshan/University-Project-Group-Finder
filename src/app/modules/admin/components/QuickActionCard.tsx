import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { QuickAction } from "../types";

export function QuickActionCard({ title, description, href, icon: Icon, cta }: QuickAction) {
  return (
    <Link href={href}>
      <Card className="group h-full rounded-3xl border-[#E5E7EB] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(59,91,219,0.14)]">
        <CardContent className="flex h-full flex-col gap-5 p-6">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] p-3 text-white shadow-md">
              <Icon className="h-5 w-5" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#6B7280] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#111827]">{title}</h3>
            <p className="text-sm leading-6 text-[#6B7280]">{description}</p>
          </div>
          <p className="mt-auto text-sm font-semibold text-[#3B5BDB]">{cta}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
