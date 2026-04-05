import { ApplicantsListView } from "@/app/modules/startup-connect/components/ApplicantsListView";
import { DashboardLayout } from "@/app/modules/startup-connect/components/DashboardLayout";

export default function ApplicantsPage() {
  return (
    <DashboardLayout
      contentClassName="bg-gradient-to-b from-sky-50/80 via-white to-emerald-50/30 px-2 py-1 sm:rounded-2xl"
    >
      <div className="max-w-6xl mx-auto">
        <ApplicantsListView />
      </div>
    </DashboardLayout>
  );
}
