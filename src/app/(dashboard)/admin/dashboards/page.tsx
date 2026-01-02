import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from "@/lib/access-control";
import { DashboardsClient } from "./dashboards-client";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-full font-protest-strike">
            <h2>
              No hay dashboards
            </h2>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <DashboardsClient dashboards={dashboards} />;
} 