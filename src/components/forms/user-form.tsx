"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import type { User } from "@prisma/client";

const userFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
  role: z.string(),
  active: z.boolean(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, isLoading = false }: UserFormProps) {
  const isEditing = !!user;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "user",
      active: user?.active ?? true,
    },
  });

  const handleSubmit = async (data: UserFormValues) => {
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
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Juan Pérez"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Nombre completo del usuario.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="juan@ejemplo.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Dirección de correo electrónico única del usuario.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña {isEditing && "(opcional)"}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isEditing ? "Dejar vacío para no cambiar" : "Contraseña del usuario"}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                {isEditing
                  ? "Dejar vacío para mantener la contraseña actual"
                  : "Contraseña para el acceso del usuario"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Rol del usuario (admin tiene acceso total)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Usuario Activo</FormLabel>
                <FormDescription>
                  Los usuarios inactivos no pueden iniciar sesión
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : user ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 