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
import { signUp } from "@/lib/auth-client";
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
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        toast.error("Error al crear usuario", {
          description: result.error.message || "No se pudo crear el usuario"
        });
        throw new Error(result.error.message || "Error al crear usuario");
      }

      toast.success("Usuario creado exitosamente", {
        description: `Se creó el usuario ${data.name} correctamente`
      });

      onOpenChange(false);
      await onSuccess();
    } catch (error) {
      console.error("Error creating user:", error);
      // Solo mostrar toast si no se mostró antes
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