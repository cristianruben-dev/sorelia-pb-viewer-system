import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConfigurationManagement } from "./configuration-management";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

export default async function ConfiguracionPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  const roles = await prisma.role.findMany({
    include: {
      _count: {
        select: {
          userRoles: true,
          powerBIContentRoles: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rolesWithCounts = roles.map((role) => ({
    id: role.id,
    name: role.name,
    isAdmin: role.isAdmin,
    createdAt: role.createdAt,
    _count: {
      users: role._count.userRoles,
      powerBIContents: role._count.powerBIContentRoles,
    },
  }));

  return (
    <div className="space-y-6">
      <ConfigurationManagement roles={rolesWithCounts} />
    </div>
  );
} 