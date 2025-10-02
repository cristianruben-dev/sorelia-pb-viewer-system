import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";
import { LogsClient } from "./logs-client";

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  return <LogsClient />;
}


