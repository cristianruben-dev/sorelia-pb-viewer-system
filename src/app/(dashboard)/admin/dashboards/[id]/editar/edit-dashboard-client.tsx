"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardForm } from "@/components/forms/dashboard-form";
import { ReportUsersManager } from "@/components/admin/report-users-manager";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { PowerBIContent } from "@prisma/client";

interface EditDashboardClientProps {
  dashboard: PowerBIContent;
}

export function EditDashboardClient({ dashboard }: EditDashboardClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/powerbi/${dashboard.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Error al actualizar dashboard", {
          description: error.error || "No se pudo actualizar el dashboard"
        });
        throw new Error(error.error || "Error al actualizar dashboard");
      }

      toast.success("Dashboard actualizado exitosamente", {
        description: `Se actualizó el dashboard "${data.title}" correctamente`
      });

      router.push("/admin/dashboards");
    } catch (error) {
      console.error("Error updating dashboard:", error);
      // Solo mostrar toast si no se mostró antes
      if (!(error instanceof Error && error.message.includes("Error al actualizar dashboard"))) {
        toast.error("Error inesperado", {
          description: "Ha ocurrido un error al actualizar el dashboard"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/dashboards">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Dashboard</h1>
          <p className="text-muted-foreground">
            Modifica la configuración de {dashboard.title}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Dashboard</CardTitle>
          <CardDescription>
            Edita los detalles del dashboard de Power BI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardForm
            dashboard={dashboard}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Gestión de usuarios */}
      <ReportUsersManager
        reportId={dashboard.id}
        reportTitle={dashboard.title}
      />
    </div>
  );
} 