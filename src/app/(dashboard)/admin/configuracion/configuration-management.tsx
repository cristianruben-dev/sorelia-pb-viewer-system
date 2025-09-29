"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Users, Shield } from "lucide-react";
import { RoleCreateDialog } from "@/components/admin/role-create-dialog";
import type { Role } from "@prisma/client";

type RoleWithCounts = Role & {
  _count: {
    users: number;
    powerBIContents: number;
  };
};

interface ConfigurationManagementProps {
  roles: RoleWithCounts[];
}

export function ConfigurationManagement({ roles }: ConfigurationManagementProps) {
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);

  const handleSuccess = async () => {
    setShowCreateRoleDialog(false);
    window.location.reload();
  };

  const roleColumns = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }: any) => {
        const role = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{role.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "isAdmin",
      header: "Tipo",
      cell: ({ row }: any) => {
        const isAdmin = row.getValue("isAdmin");
        return (
          <Badge variant={isAdmin ? "destructive" : "secondary"}>
            {isAdmin ? "Administrador" : "Usuario"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "_count.users",
      header: "Usuarios",
      cell: ({ row }: any) => {
        const count = row.original._count.users;
        return <Badge variant="outline">{count}</Badge>;
      },
    },
    {
      accessorKey: "_count.powerBIContents",
      header: "Reportes",
      cell: ({ row }: any) => {
        const count = row.original._count.powerBIContents;
        return <Badge variant="outline">{count}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-1">
        {/* Gestión de Roles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles de Usuario
              </CardTitle>
              <CardDescription>
                Sistema dinámico de roles 1:1 - Cada rol accede únicamente a su nivel correspondiente
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateRoleDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Rol
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              data={roles}
              columns={roleColumns}
            />
          </CardContent>
        </Card>
      </div>

      <RoleCreateDialog
        open={showCreateRoleDialog}
        onOpenChange={setShowCreateRoleDialog}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 