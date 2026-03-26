import { ApplicantsListView } from "@/app/modules/startup-connect/components/ApplicantsListView";
import { DashboardLayout } from "@/app/modules/startup-connect/components/DashboardLayout";

export default function ApplicantsPage() {
  return (
    <DashboardLayout className="bg-white" contentClassName="px-2">
      <div className="max-w-6xl mx-auto">
        <ApplicantsListView />
      </div>
    </DashboardLayout>
  );
}
