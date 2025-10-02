import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, BarChart3 } from "lucide-react";
import Link from "next/link";
import { isUserAdmin } from "@/lib/access-control";
import { DashboardsClient } from "./dashboards-client";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

export default async function DashboardsAdminPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  const dashboards = await prisma.powerBIContent.findMany({
    include: {
      _count: {
        select: {
          userAccess: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (dashboards.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={BarChart3}
          title="No hay dashboards"
          description="Comienza creando tu primer dashboard de Power BI"
          action={
            <Button asChild>
              <Link href="/admin/dashboards/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Crear Dashboard
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <DashboardsClient dashboards={dashboards} />;
} 