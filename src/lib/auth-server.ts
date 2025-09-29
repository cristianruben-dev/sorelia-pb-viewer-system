import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { User, UserRole, Role } from "@prisma/client";
import { headers } from "next/headers";

export type UserWithRoles = User & {
  roles: (UserRole & {
    role: Role;
  })[];
};

export type UserWithSubscription = UserWithRoles;

/**
 * Obtiene la sesión del servidor
 */
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

/**
 * Obtiene el usuario actual con información de roles
 */
export async function getCurrentUser(): Promise<UserWithRoles> {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Para obtener los roles desde la base de datos en lugar de la sesión
  const userWithRoles = await db.user.findUnique({
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

/**
 * Obtiene el usuario actual si está autenticado, sino retorna null
 * Útil para páginas que pueden mostrar contenido diferente según autenticación
 */
export async function getOptionalUser(): Promise<UserWithRoles | null> {
  const session = await getServerSession();

  if (!session?.user) {
    return null;
  }

  const userWithRoles = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  return userWithRoles;
}

/**
 * Función para obtener un usuario con su suscripción y datos relacionados
 * Solo funciona desde el lado del servidor
 */
export async function getUser(): Promise<UserWithSubscription | null> {
  const session = await auth.api.getSession({
    headers: {} as any
  });

  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return user;
} 