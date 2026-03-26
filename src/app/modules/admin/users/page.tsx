import { Eye, ShieldMinus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AdminTable } from "../components/AdminTable";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { users } from "../utils/mock-data";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="User management"
        title="Users and account moderation"
        description="Review user roles, status changes, and onboarding activity without wiring backend services yet."
      />

      <SearchFilterBar
        placeholder="Search users by name or email"
        filters={[
          { label: "All roles", options: [{ label: "Student", value: "student" }, { label: "Tutor", value: "tutor" }, { label: "Startup", value: "startup" }] },
          { label: "All statuses", options: [{ label: "Active", value: "active" }, { label: "Pending", value: "pending" }, { label: "Suspended", value: "suspended" }] },
        ]}
        action={
          <Button className="h-11 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] px-5 text-white hover:opacity-95">
            Add user
          </Button>
        }
      />

      <AdminTable
        data={users}
        columns={[
          {
            key: "name",
            header: "Name",
            render: (row) => (
              <div className="space-y-1">
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-[#6B7280]">{row.email}</p>
              </div>
            ),
          },
          { key: "email", header: "Email", render: (row) => <span className="text-[#6B7280]">{row.email}</span> },
          { key: "role", header: "Role", render: (row) => row.role },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "joined", header: "Joined date", render: (row) => row.joinedDate },
          {
            key: "actions",
            header: "Actions",
            render: () => (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-xl border-[#D8E1F0] text-[#3B5BDB]">
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
                <Button variant="secondary" size="sm" className="rounded-xl bg-[#EEF4FF] text-[#3B5BDB]">
                  <ShieldMinus className="mr-1 h-4 w-4" />
                  Suspend
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-rose-200 text-rose-600">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
