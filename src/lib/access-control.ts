import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export type AuthUser = User;

/**
 * Verifica si un usuario es administrador
 */
export function isUserAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role.includes("admin");
}

/**
 * Obtiene los roles de un usuario como array
 */
export function getUserRoles(user: User): string[] {
  return user.role.split(",").map(r => r.trim());
}

/**
 * Verifica si un usuario tiene acceso a un reporte específico
 */
export async function canUserAccessReport(user: User | null, reportId: string): Promise<boolean> {
  if (!user) return false;

  // Los administradores tienen acceso a todo
  if (isUserAdmin(user)) return true;

  // Verificar si el usuario tiene acceso directo al reporte
  const access = await prisma.userReportAccess.findUnique({
    where: {
      userId_reportId: {
        userId: user.id,
        reportId,
      },
    },
  });

  return !!access;
}

/**
 * Filtra reportes accesibles para un usuario específico
 */
export async function filterAccessibleReports(user: User | null) {
  if (!user) return [];

  // Si es admin, devolver todos los reportes
  if (isUserAdmin(user)) {
    return await prisma.powerBIContent.findMany({
      include: {
        userAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Para usuarios normales, solo reportes a los que tienen acceso
  return await prisma.powerBIContent.findMany({
    where: {
      userAccess: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      userAccess: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
