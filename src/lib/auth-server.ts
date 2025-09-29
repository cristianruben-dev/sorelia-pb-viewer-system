import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

import type { UserWithRoles } from "./access-control";

export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<UserWithRoles> {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Para obtener los roles desde la base de datos en lugar de la sesión
  const userWithRoles = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!userWithRoles) {
    redirect("/login");
  }

  return userWithRoles;
}
