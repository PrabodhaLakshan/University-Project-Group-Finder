import { BellRing, FolderTree, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Settings"
        title="Admin profile and platform configuration"
        description="Placeholders are ready for profile management, notifications, and category administration."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#EEF4FF] p-3 text-[#3B5BDB]">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#111827]">Admin profile</h3>
              <p className="text-sm text-[#6B7280]">Basic profile fields for future persistence.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input defaultValue="Admin Director" className="h-11 rounded-2xl border-[#E5E7EB] bg-[#F8FAFC]" />
            <Input defaultValue="ops@uninexus.edu" className="h-11 rounded-2xl border-[#E5E7EB] bg-[#F8FAFC]" />
            <Input defaultValue="Operations" className="h-11 rounded-2xl border-[#E5E7EB] bg-[#F8FAFC]" />
            <Input defaultValue="+94 77 555 0123" className="h-11 rounded-2xl border-[#E5E7EB] bg-[#F8FAFC]" />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button className="h-11 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] px-5 text-white hover:opacity-95">
              Save changes
            </Button>
            <Button variant="outline" className="h-11 rounded-2xl border-[#D8E1F0] px-5 text-[#3B5BDB]">
              Reset
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#FFF7ED] p-3 text-[#F97316]">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#111827]">Notification settings</h3>
              <p className="text-sm text-[#6B7280]">Manage alert delivery preferences for admin operations.</p>
            </div>
          </div>
          <div className="space-y-3">
            {["Urgent reports", "Verification queue alerts", "Daily analytics digest"].map((setting) => (
              <label
                key={setting}
                className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3"
              >
                <span className="text-sm font-medium text-[#111827]">{setting}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#3B5BDB]" />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[#EEF4FF] p-3 text-[#3B5BDB]">
            <FolderTree className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111827]">Category management</h3>
            <p className="text-sm text-[#6B7280]">Reserved space for marketplace, tutor subjects, and startup domain taxonomies.</p>
          </div>
        </div>
        <EmptyState
          icon={FolderTree}
          title="Category tools can plug in here"
          description="The card is already sized and styled for future CRUD forms, service calls, or moderation workflows."
        />
      </section>
    </div>
  );
}
