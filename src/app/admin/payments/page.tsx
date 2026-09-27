import { requireAdmin } from "@/lib/auth";
import AdminPaymentsClient from "./AdminPaymentsClient";

export default async function AdminPaymentsPage() {
  await requireAdmin();
  return <AdminPaymentsClient />;
}
