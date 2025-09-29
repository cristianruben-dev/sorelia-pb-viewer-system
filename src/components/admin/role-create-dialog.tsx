"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleForm } from "@/components/forms/role-form";
import { toast } from "sonner";

interface RoleCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function RoleCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: RoleCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    isAdmin: boolean;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Error al crear rol", {
          description: error.error || "No se pudo crear el rol"
        });
        throw new Error(error.error || "Error al crear rol");
      }

      toast.success("Rol creado exitosamente", {
        description: `Se creó el rol ${data.name} correctamente`
      });

      onOpenChange(false);
      await onSuccess();
    } catch (error) {
      if (!(error instanceof Error && error.message.includes("Error al crear rol"))) {
        toast.error("Error inesperado", {
          description: "Ha ocurrido un error al crear el rol"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Rol</DialogTitle>
          <DialogDescription>
            Crea un nuevo rol de usuario en el sistema
          </DialogDescription>
        </DialogHeader>

        <RoleForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
} 