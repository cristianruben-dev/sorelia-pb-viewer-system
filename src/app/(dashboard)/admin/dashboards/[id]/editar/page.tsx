import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { EditDashboardClient } from "./edit-dashboard-client";
import { isUserAdmin } from "@/lib/access-control";

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

  const dashboard = await prisma.powerBIContent.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!dashboard) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <EditDashboardClient
        dashboard={dashboard}
      />
    </div>
  );
} 