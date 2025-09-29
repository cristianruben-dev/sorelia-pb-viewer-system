import { db } from "@/lib/db";
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

/**
 * Verifica si un usuario tiene rol de administrador
 */
export function isUserAdmin(user: UserWithRoles | null): boolean {
  if (!user) return false;
  return user.roles.some(userRole => userRole.role.isAdmin);
}

/**
 * Obtiene los nombres de todos los roles de un usuario
 */
export function getUserRoleNames(user: UserWithRoles): string[] {
  return user.roles.map(userRole => userRole.role.name);
}

/**
 * Verifica si un usuario puede acceder a un reporte específico
 */
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
 * Función para verificar si un reporte individual es accesible
 */
export function canUserAccessSingleReport(user: UserWithRoles | null, report: PowerBIContentWithRoles): boolean {
  return canUserAccessReport(user, report.roles);
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

  return await db.powerBIContent.findMany({
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

/**
 * Helper para obtener el rol primario de un usuario (para compatibilidad)
 * Retorna el primer rol admin si existe, sino el primer rol
 */
export function getPrimaryRole(user: UserWithRoles | null): {
  id: string;
  name: string;
  isAdmin: boolean;
} | null {
  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  // Primero buscar un rol admin
  const adminRole = user.roles.find(userRole => userRole.role.isAdmin);
  if (adminRole) {
    return adminRole.role;
  }

  // Si no hay admin, retornar el primer rol
  return user.roles[0]?.role || null;
}

/**
 * Obtiene todos los roles desde la base de datos
 */
export async function getActiveRoles() {
  return await db.role.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Obtiene todos los niveles de acceso desde la base de datos (alias para getActiveRoles)
 */
export async function getActiveAccessLevels() {
  return await db.role.findMany({
    orderBy: { name: "asc" },
  });
} 