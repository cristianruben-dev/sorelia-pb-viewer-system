import { prisma } from "@/lib/prisma";
import type { User, Role, PowerBIContent, UserRole, PowerBIContentRole } from "@prisma/client";

export type UserWithRoles = User & {
  roles: (UserRole & {
    role: Role;
  })[];
};

export type PowerBIContentWithRoles = PowerBIContent & {
  roles: (PowerBIContentRole & {
    role: Role;
  })[];
};

export function isUserAdmin(user: UserWithRoles | null): boolean {
  if (!user) return false;
  return user.roles.some(userRole => userRole.role.isAdmin);
}

export function getUserRoleNames(user: UserWithRoles): string[] {
  return user.roles.map(userRole => userRole.role.name);
}

export function canUserAccessReport(user: UserWithRoles | null, reportRoles: (PowerBIContentRole & { role: Role })[] | null): boolean {
  if (!user) return false;

  // Los administradores tienen acceso a todo
  if (isUserAdmin(user)) return true;

  // Si el reporte no tiene roles asignados, no es accesible
  if (!reportRoles || reportRoles.length === 0) return false;

  // Obtener los nombres de roles del usuario
  const userRoleNames = getUserRoleNames(user);

  // Verificar si el usuario tiene al menos uno de los roles requeridos
  return reportRoles.some(reportRole =>
    userRoleNames.includes(reportRole.role.name)
  );
}

/**
 * Filtra reportes accesibles para un usuario específico
 */
export async function filterAccessibleReports(user: UserWithRoles | null) {
  if (!user) return [];

  const whereClause = isUserAdmin(user)
    ? { published: true } // Admin ve todo
    : {
      published: true,
      roles: {
        some: {
          role: {
            name: {
              in: getUserRoleNames(user)
            }
          }
        }
      }
    };

  return await prisma.powerBIContent.findMany({
    where: whereClause,
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Determina la variante del badge basado en el rol
 */
export function getBadgeVariant(roleName: string): "default" | "secondary" | "destructive" | "outline" {
  const name = roleName.toLowerCase();

  if (name.includes("admin")) {
    return "destructive";
  } else if (name.includes("premium") || name.includes("pro")) {
    return "default";
  } else if (name.includes("free") || name.includes("basic")) {
    return "secondary";
  }

  return "outline";
}
