import { redirect } from "next/navigation";
import { AdminTeam } from "@/components/AdminTeam";
import { getAdminEmail } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admins",
};

export default async function AdminsPage() {
  if (!(await getAdminEmail())) {
    redirect("/admin/login");
  }
  return <AdminTeam />;
}
