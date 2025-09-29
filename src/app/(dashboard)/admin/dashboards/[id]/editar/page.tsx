import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";
import { EditDashboardClient } from "./edit-dashboard-client";
import { isUserAdmin } from "@/lib/access-control";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

export default async function EditDashboardPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/admin");
  }

  const [dashboard, accessLevels] = await Promise.all([
    db.powerBIContent.findUnique({
      where: { id: resolvedParams.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    }),
    db.role.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!dashboard) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <EditDashboardClient
        dashboard={dashboard}
        accessLevels={accessLevels}
      />
    </div>
  );
} 