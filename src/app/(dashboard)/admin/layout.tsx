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
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Gestiona usuarios, roles y dashboards del sistema
        </p>
      </div>

      <AdminNavigation />

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
} 