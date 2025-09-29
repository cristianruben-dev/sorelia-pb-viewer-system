import type { User, UserRole } from "@prisma/client";

export type UserWithRoles = User & {
  roles: Array<UserRole & {
    role: {
      id: string;
      name: string;
      isAdmin: boolean;
    };
  }>;
};

export type UserWithSubscription = UserWithRoles;

// Legacy helper para compatibilidad
export type UserWithRole = UserWithRoles;
