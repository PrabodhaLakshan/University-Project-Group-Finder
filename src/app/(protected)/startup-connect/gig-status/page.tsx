import { DashboardLayout } from "@/app/modules/startup-connect/components/DashboardLayout";
import { GigStatusView } from "@/app/modules/startup-connect/components/GigStatusView";

export default function GigStatusPage() {
  return (
    <DashboardLayout contentClassName="bg-gradient-to-b from-sky-50/80 via-white to-emerald-50/30 px-2 py-1 sm:rounded-2xl">
      <div className="mx-auto max-w-6xl">
        <GigStatusView />
      </div>
    </DashboardLayout>
  );
}
