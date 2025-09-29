"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Role } from "@prisma/client";

const roleFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").regex(/^[A-Z_]+$/, "Solo letras mayúsculas y guiones bajos"),
  isAdmin: z.boolean(),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  role?: Role;
  onSubmit: (data: RoleFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function RoleForm({ role, onSubmit, isLoading = false }: RoleFormProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || "",
      isAdmin: role?.isAdmin || false,
    },
  });

  const handleSubmit = async (data: RoleFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Rol</FormLabel>
              <FormControl>
                <Input
                  placeholder="PREMIUM_USER"
                  {...field}
                  disabled={isLoading || !!role} // No editable si es edición
                />
              </FormControl>
              <FormDescription>
                Identificador único del rol. Solo mayúsculas y guiones bajos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Administrador</FormLabel>
                <FormDescription>
                  Los administradores tienen acceso total al sistema.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : role ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 