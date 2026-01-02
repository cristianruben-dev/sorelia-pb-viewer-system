"use client";

import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { QuickAccessControl } from "@/components/admin/quick-access-control";
import { Pencil, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

import type { ColumnDef } from "@tanstack/react-table";
import type { PowerBIContent } from "@prisma/client";

import Link from "next/link";

type DashboardWithCounts = PowerBIContent & {
  _count: {
    userAccess: number;
  };
};

export const createDashboardColumns = (
  onDelete: () => void,
  onUpdate?: () => void
): ColumnDef<DashboardWithCounts>[] => [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Título
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("title")}</div>;
      },
    },
    {
      accessorKey: "_count.userAccess",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Usuarios con Acceso
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dashboard = row.original;
        const count = dashboard._count.userAccess;
        return (
          <QuickAccessControl
            dashboardId={dashboard.id}
            dashboardTitle={dashboard.title}
            userCount={count}
            onUpdate={onUpdate}
          />
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha de Creación
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString("es-MX")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const dashboard = row.original;

        const handleDelete = async () => {
          try {
            const response = await fetch(`/api/admin/powerbi/${dashboard.id}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              toast.error("Error al eliminar dashboard", {
                description: "No se pudo eliminar el dashboard del sistema",
              });
              throw new Error("Error al eliminar dashboard");
            }

            toast.success("Dashboard eliminado", {
              description: `El dashboard ${dashboard.title} ha sido eliminado correctamente`,
            });

            onDelete();
          } catch (error) {
            if (
              !(error instanceof Error && error.message.includes("Error al eliminar dashboard"))
            ) {
              toast.error("Error inesperado", {
                description: "Ha ocurrido un error al eliminar el dashboard",
              });
            }
          }
        };

        return (
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/reportes/${dashboard.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/dashboards/${dashboard.id}/editar`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteConfirmationDialog
              trigger={
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              }
              title="Eliminar Dashboard"
              description="¿Estás seguro de que quieres eliminar este dashboard? Esta acción no se puede deshacer."
              onConfirm={handleDelete}
            />
          </div>
        );
      },
    },
  ];


