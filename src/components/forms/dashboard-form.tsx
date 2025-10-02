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
import type { PowerBIContent } from "@prisma/client";

const dashboardFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  iframeHtml: z.string().optional(),
});

type DashboardFormValues = z.infer<typeof dashboardFormSchema>;

interface DashboardFormProps {
  dashboard?: PowerBIContent;
  onSubmit: (data: DashboardFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function DashboardForm({ dashboard, onSubmit, isLoading = false }: DashboardFormProps) {
  const form = useForm<DashboardFormValues>({
    resolver: zodResolver(dashboardFormSchema),
    defaultValues: {
      title: dashboard?.title || "",
      iframeHtml: dashboard?.iframeHtml || "",
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

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : dashboard ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 