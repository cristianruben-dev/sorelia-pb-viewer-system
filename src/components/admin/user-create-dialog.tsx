"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/forms/user-form";
import { toast } from "sonner";

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export function UserCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: UserCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
    role: string;
    active: boolean;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Error al crear usuario", {
          description: error.error || "No se pudo crear el usuario"
        });
        throw new Error(error.error || "Error al crear usuario");
      }

      toast.success("Usuario creado exitosamente", {
        description: `Se creó el usuario ${data.name} correctamente`
      });

      onOpenChange(false);
      await onSuccess();
    } catch (error) {
      if (!(error instanceof Error && error.message.includes("Error al crear usuario"))) {
        toast.error("Error inesperado", {
          description: "Ha ocurrido un error al crear el usuario"
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
          <DialogTitle>Crear Usuario</DialogTitle>
          <DialogDescription>
            Crea un nuevo usuario en el sistema
          </DialogDescription>
        </DialogHeader>

        <UserForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
} 