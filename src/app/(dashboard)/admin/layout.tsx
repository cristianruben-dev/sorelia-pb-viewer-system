import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { isUserAdmin } from "@/lib/access-control";
import { AdminNavigation } from "./admin-navigation";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <AdminNavigation />

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
} 