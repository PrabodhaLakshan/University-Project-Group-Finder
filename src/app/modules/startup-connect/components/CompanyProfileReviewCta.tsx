"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddReviewModal } from "./AddReviewModal";

export function CompanyProfileReviewCta({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-2 border-t border-slate-100 pt-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Worked with this startup?
        </p>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-orange-500 px-8 py-6 font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-orange-100 hover:bg-slate-900"
        >
          <PenLine size={14} className="mr-2 inline" />
          Write a review
        </Button>
      </div>
      {open && (
        <AddReviewModal
          companyId={companyId}
          onClose={() => setOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
