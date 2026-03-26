import { Eye, EyeOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AdminTable } from "../components/AdminTable";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { marketplacePosts } from "../utils/mock-data";

export default function AdminUniMartPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Uni Mart"
        title="Marketplace moderation"
        description="Track listings, seller activity, and risky posts using reusable table actions."
      />

      <SearchFilterBar
        placeholder="Search listings by title or seller"
        filters={[
          { label: "All categories", options: [{ label: "Electronics", value: "electronics" }, { label: "Books", value: "books" }, { label: "Phones", value: "phones" }] },
          { label: "All statuses", options: [{ label: "Active", value: "active" }, { label: "Reported", value: "reported" }, { label: "Pending", value: "pending" }] },
        ]}
        action={<Button className="h-11 rounded-2xl bg-[#3B5BDB] px-5 text-white hover:bg-[#314ab4]">Export listings</Button>}
      />

      <AdminTable
        data={marketplacePosts}
        columns={[
          {
            key: "title",
            header: "Item title",
            render: (row) => (
              <div className="space-y-1">
                <p className="font-semibold">{row.itemTitle}</p>
                <p className="text-xs text-[#6B7280]">{row.category}</p>
              </div>
            ),
          },
          { key: "seller", header: "Seller", render: (row) => row.seller },
          { key: "category", header: "Category", render: (row) => row.category },
          { key: "price", header: "Price", render: (row) => row.price },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "reports", header: "Reports", render: (row) => <span className="font-semibold text-[#F97316]">{row.reports}</span> },
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
                  <EyeOff className="mr-1 h-4 w-4" />
                  Hide
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
