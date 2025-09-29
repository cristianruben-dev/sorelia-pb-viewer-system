import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { DashboardNav } from "@/components/dashboard-nav";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav user={user} />

      <main className="flex-1 overflow-y-auto p-4 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
} 