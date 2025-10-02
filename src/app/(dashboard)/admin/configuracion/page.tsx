import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";
import { ConfigurationClient } from "./configuration-client";

export const dynamic = 'force-dynamic';

export default async function ConfigurationPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  return <ConfigurationClient />;
}


