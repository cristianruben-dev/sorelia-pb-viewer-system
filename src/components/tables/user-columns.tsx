"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { UserRolesPopover } from "@/components/admin/user-roles-popover";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { UserWithRoles } from "@/lib/access-control";

export const createUserColumns = (onRolesUpdated: () => void): ColumnDef<UserWithRoles>[] => [
  {
    accessorKey: "name",
    header: "Usuario",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const user = row.original;
      const roles = user.roles.map(ur => ur.role);

      if (roles.length === 0) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline">Sin roles</Badge>
            <UserRolesPopover user={user} onRolesUpdated={onRolesUpdated} />
          </div>
        );
      }

      // Mostrar los primeros 2 roles
      const visibleRoles = roles.slice(0, 2);
      const remainingCount = roles.length - visibleRoles.length;

      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1 items-center">
            {visibleRoles.map(role => (
              <Badge
                key={role.id}
                variant={role.isAdmin ? "destructive" : "secondary"}
              >
                {role.name}
              </Badge>
            ))}

            {remainingCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help">
                      +{remainingCount} más
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col gap-1 p-1">
                      {roles.slice(2).map(role => (
                        <Badge
                          key={role.id}
                          variant={role.isAdmin ? "destructive" : "secondary"}
                          className="my-1"
                        >
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <UserRolesPopover user={user} onRolesUpdated={onRolesUpdated} />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;

      const handleDelete = async () => {
        try {
          const response = await fetch(`/api/admin/users/${user.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            toast.error("Error al eliminar usuario", {
              description: "No se pudo eliminar el usuario del sistema"
            });
            throw new Error("Error al eliminar usuario");
          }

          toast.success("Usuario eliminado", {
            description: `El usuario ${user.name} ha sido eliminado correctamente`
          });

          onRolesUpdated(); // Recargar datos después de eliminar
        } catch (error) {
          if (!(error instanceof Error && error.message.includes("Error al eliminar usuario"))) {
            toast.error("Error inesperado", {
              description: "Ha ocurrido un error al eliminar el usuario"
            });
          }
        }
      };

      return (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            title="Editar usuario"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <DeleteConfirmationDialog
            trigger={
              <Button
                variant="outline"
                size="sm"
                title="Eliminar usuario"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            }
            title="Eliminar Usuario"
            description="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
            onConfirm={handleDelete}
          />
        </div>
      );
    },
  },
];

export const userColumns = createUserColumns(() => { }); 