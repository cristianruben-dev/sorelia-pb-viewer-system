import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UsersManagement } from "./users-management";
import { isUserAdmin } from "@/lib/access-control";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
      _count: {
        select: {
          sessions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <UsersManagement users={users} />;
} 