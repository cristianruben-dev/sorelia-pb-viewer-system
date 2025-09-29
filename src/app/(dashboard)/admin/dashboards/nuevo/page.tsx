import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-server";
import { NuevoDashboardClient } from "./nuevo-dashboard-client";
import { isUserAdmin } from "@/lib/access-control";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

export default async function NuevoDashboardPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  const accessLevels = await db.role.findMany({
    orderBy: { name: "asc" },
  });

  return <NuevoDashboardClient accessLevels={accessLevels} />;
} 