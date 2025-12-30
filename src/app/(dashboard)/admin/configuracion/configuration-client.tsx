"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Settings, Upload, X } from "lucide-react";
import Image from "next/image";

const configSchema = z.object({
  site_title: z.string().min(1, "El título es requerido"),
  site_logo: z.string().optional(),
  site_favicon: z.string().optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export function ConfigurationClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      site_title: "Sistema Visualizador",
      site_logo: "",
      site_favicon: "",
    },
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/admin/config");
      if (!response.ok) throw new Error("Error al cargar configuración");

      const data = await response.json();
      const config = data.config || {};

      form.reset({
        site_title: config.site_title || "Sistema Visualizador",
        site_logo: config.site_logo || "",
        site_favicon: config.site_favicon || "",
      });

      setLogoPreview(config.site_logo || "");
      setFaviconPreview(config.site_favicon || "");
    } catch (error) {
      console.error("Error fetching config:", error);
      toast.error("Error al cargar la configuración");
    } finally {
      setIsFetching(false);
    }
  };

  const uploadFile = async (file: File, type: "logo" | "favicon") => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/config/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al subir archivo");
    }

    const data = await response.json();
    return data.url;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "favicon"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (type === "logo") {
        setUploadingLogo(true);
      } else {
        setUploadingFavicon(true);
      }

      const url = await uploadFile(file, type);

      if (type === "logo") {
        form.setValue("site_logo", url);
        setLogoPreview(url);
      } else {
        form.setValue("site_favicon", url);
        setFaviconPreview(url);
      }

      toast.success(`${type === "logo" ? "Logo" : "Favicon"} subido correctamente`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al subir archivo"
      );
    } finally {
      if (type === "logo") {
        setUploadingLogo(false);
      } else {
        setUploadingFavicon(false);
      }
    }
  };

  const removeImage = (type: "logo" | "favicon") => {
    if (type === "logo") {
      form.setValue("site_logo", "");
      setLogoPreview("");
    } else {
      form.setValue("site_favicon", "");
      setFaviconPreview("");
    }
  };

  const onSubmit = async (data: ConfigFormValues) => {
    setIsLoading(true);
    try {
      // Actualizar cada configuración
      await Promise.all([
        fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "site_title", value: data.site_title }),
        }),
        fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "site_logo", value: data.site_logo || "" }),
        }),
        fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "site_favicon", value: data.site_favicon || "" }),
        }),
      ]);

      toast.success("Configuración guardada", {
        description: "Los cambios se han guardado correctamente",
      });

      // Recargar para aplicar cambios
      window.location.reload();
    } catch (error) {
      toast.error("Error", {
        description: "Error al guardar la configuración",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h2>
        <p className="text-muted-foreground">
          Personaliza la apariencia y configuración del sistema
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Información General
              </CardTitle>
              <CardDescription>
                Configura el título y la identidad visual del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="site_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Sistema</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Sistema Visualizador" />
                    </FormControl>
                    <FormDescription>
                      Este título aparecerá en el navegador y en el encabezado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Logotipo</CardTitle>
              <CardDescription>
                Sube el logo que aparecerá en el encabezado del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {logoPreview ? (
                <div className="relative inline-block">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={200}
                    height={60}
                    className="rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeImage("logo")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    No hay logo configurado
                  </p>
                </div>
              )}

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                  disabled={uploadingLogo}
                  className="cursor-pointer"
                />
                {uploadingLogo && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Subiendo logo...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Favicon */}
          <Card>
            <CardHeader>
              <CardTitle>Favicon</CardTitle>
              <CardDescription>
                Sube el favicon que aparecerá en la pestaña del navegador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faviconPreview ? (
                <div className="relative inline-block">
                  <Image
                    src={faviconPreview}
                    alt="Favicon preview"
                    width={32}
                    height={32}
                    className="rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeImage("favicon")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    No hay favicon configurado
                  </p>
                </div>
              )}

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "favicon")}
                  disabled={uploadingFavicon}
                  className="cursor-pointer"
                />
                {uploadingFavicon && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Subiendo favicon...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

