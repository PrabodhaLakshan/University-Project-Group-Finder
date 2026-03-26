import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/modules/admin/dashboard");
}
