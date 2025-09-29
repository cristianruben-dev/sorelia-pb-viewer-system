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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { PowerBIContent, Role, PowerBIContentRole } from "@prisma/client";

const dashboardFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  tags: z.array(z.string()).optional(),
  roleIds: z.array(z.string()).min(1, "Debe seleccionar al menos un rol"),
  iframeHtml: z.string().optional(),
  published: z.boolean(),
});

type DashboardFormValues = z.infer<typeof dashboardFormSchema>;

type PowerBIContentWithRoles = PowerBIContent & {
  roles: (PowerBIContentRole & {
    role: Role;
  })[];
};

interface DashboardFormProps {
  dashboard?: PowerBIContentWithRoles;
  accessLevels: Role[];
  onSubmit: (data: DashboardFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function DashboardForm({ dashboard, accessLevels, onSubmit, isLoading = false }: DashboardFormProps) {
  const form = useForm<DashboardFormValues>({
    resolver: zodResolver(dashboardFormSchema),
    defaultValues: {
      title: dashboard?.title || "",
      tags: dashboard?.tags || [],
      roleIds: dashboard?.roles?.map(r => r.role.id) || [],
      iframeHtml: dashboard?.iframeHtml || "",
      published: dashboard?.published || false,
    },
  });

  const handleSubmit = async (data: DashboardFormValues) => {
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  placeholder="Título del dashboard"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Título descriptivo del dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roleIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Roles de Acceso</FormLabel>
                <FormDescription>
                  Selecciona los roles que pueden acceder a este dashboard.
                </FormDescription>
              </div>
              {accessLevels.map((role) => (
                <FormField
                  key={role.id}
                  control={form.control}
                  name="roleIds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={role.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, role.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== role.id
                                  )
                                )
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          <div className="flex items-center space-x-2">
                            <span>{role.name}</span>
                            {role.isAdmin && (
                              <span className="text-xs text-red-600">(Admin)</span>
                            )}
                          </div>
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="iframeHtml"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código HTML</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="<iframe src='...' ...></iframe>"
                  {...field}
                  disabled={isLoading}
                  rows={5}
                />
              </FormControl>
              <FormDescription>
                Código HTML del iframe de Power BI.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
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
                <FormLabel>Publicado</FormLabel>
                <FormDescription>
                  El dashboard será visible para los usuarios con los roles asignados.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : dashboard ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 