import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { NuevoDashboardClient } from "./nuevo-dashboard-client";
import { isUserAdmin } from "@/lib/access-control";

export const dynamic = 'force-dynamic';

export default async function NuevoDashboardPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  return <NuevoDashboardClient />;
} 