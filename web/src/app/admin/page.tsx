import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { getAdminEmail } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const email = await getAdminEmail();
  if (!email) {
    redirect("/admin/login");
  }
  return <AdminDashboard email={email} />;
}
