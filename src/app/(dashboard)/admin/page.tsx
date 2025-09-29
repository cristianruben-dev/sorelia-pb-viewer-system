import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  redirect("/admin/usuarios");
} 