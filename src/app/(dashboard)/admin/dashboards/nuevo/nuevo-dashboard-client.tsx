"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardForm } from "@/components/forms/dashboard-form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Role } from "@prisma/client";

interface NuevoDashboardClientProps {
  accessLevels: Role[];
}

export function NuevoDashboardClient({ accessLevels }: NuevoDashboardClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/powerbi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Error al crear dashboard", {
          description: error.error || "No se pudo crear el dashboard"
        });
        throw new Error(error.error || "Error al crear dashboard");
      }

      toast.success("Dashboard creado exitosamente", {
        description: `Se creó el dashboard "${data.title}" correctamente`
      });

      router.push("/admin/dashboards");
    } catch (error) {
      console.error("Error creating dashboard:", error);
      // Solo mostrar toast si no se mostró antes
      if (!(error instanceof Error && error.message.includes("Error al crear dashboard"))) {
        toast.error("Error inesperado", {
          description: "Ha ocurrido un error al crear el dashboard"
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
          <h1 className="text-2xl font-bold">Nuevo Dashboard</h1>
          <p className="text-muted-foreground">
            Crea un nuevo dashboard de Power BI
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Dashboard</CardTitle>
          <CardDescription>
            Configura los detalles del nuevo dashboard de Power BI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardForm
            accessLevels={accessLevels}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
} 