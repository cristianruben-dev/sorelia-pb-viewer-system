"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Role } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  roleIds: z.array(z.string()).min(1, "Debe seleccionar al menos un rol"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleIds: [],
    },
  });

  // Cargar roles disponibles
  useEffect(() => {
    fetch("/api/admin/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((error) => {
        console.error(error);
        toast.error("Error al cargar roles", {
          description: "No se pudieron cargar los roles disponibles"
        });
      });
  }, []);

  const handleAddRole = () => {
    if (!selectedRoleId) return;

    const roleToAdd = roles.find(r => r.id === selectedRoleId);
    if (!roleToAdd || selectedRoles.some(r => r.id === selectedRoleId)) {
      return;
    }

    // Actualizar el estado local
    setSelectedRoles([...selectedRoles, roleToAdd]);

    // Actualizar el formulario
    const currentRoleIds = getValues("roleIds");
    setValue("roleIds", [...currentRoleIds, selectedRoleId]);

    // Limpiar la selección
    setSelectedRoleId("");

    toast.success("Rol agregado", {
      description: `Se agregó el rol ${roleToAdd.name}`
    });
  };

  const handleRemoveRole = (roleId: string) => {
    const roleToRemove = selectedRoles.find(r => r.id === roleId);

    // Actualizar el estado local
    setSelectedRoles(selectedRoles.filter(r => r.id !== roleId));

    // Actualizar el formulario
    const currentRoleIds = getValues("roleIds");
    setValue("roleIds", currentRoleIds.filter(id => id !== roleId));

    if (roleToRemove) {
      toast.info("Rol eliminado", {
        description: `Se eliminó el rol ${roleToRemove.name}`
      });
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Registrar usuario
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        setError(result.error.message || "Error al crear la cuenta");
        toast.error("Error en el registro", {
          description: result.error.message || "No se pudo crear la cuenta"
        });
        setIsLoading(false);
        return;
      }

      // Si el registro fue exitoso, asignar roles al usuario
      if (result) {
        try {
          // Obtener el usuario por email para conseguir su ID
          const userResponse = await fetch(`/api/admin/users/by-email?email=${encodeURIComponent(data.email)}`);
          const userData = await userResponse.json();

          if (!userData || !userData.id) {
            throw new Error("No se pudo encontrar el usuario recién creado");
          }

          // Asignar roles al usuario recién creado
          await Promise.all(
            data.roleIds.map(roleId =>
              fetch("/api/admin/users/roles", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: userData.id,
                  roleId: roleId,
                }),
              })
            )
          );

          setSuccess(true);
          toast.success("¡Cuenta creada exitosamente!", {
            description: "Tu cuenta ha sido creada y los roles asignados correctamente"
          });
        } catch (roleError) {
          console.error("Error al asignar roles:", roleError);
          setError("La cuenta se creó pero hubo un error al asignar los roles");
          toast.warning("Cuenta creada parcialmente", {
            description: "La cuenta se creó pero hubo un error al asignar los roles"
          });
        }
      }
    } catch (err) {
      const errorMessage = "Error al crear la cuenta. Inténtalo de nuevo.";
      setError(errorMessage);
      toast.error("Error de registro", {
        description: "Ha ocurrido un error inesperado durante el registro"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>¡Cuenta creada!</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/login")} className="w-full">
            Ir al Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Crear Cuenta</CardTitle>
        <CardDescription className="text-muted-foreground">
          Ingresa tus datos para crear una nueva cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                disabled={isLoading}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center space-x-2">
                        <span>{role.name}</span>
                        {role.isAdmin && (
                          <span className="text-xs text-red-600">(Admin)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddRole}
                disabled={!selectedRoleId || isLoading}
              >
                Agregar
              </Button>
            </div>

            {/* Lista de roles seleccionados */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRoles.map((role) => (
                <Badge
                  key={role.id}
                  variant={role.isAdmin ? "destructive" : "secondary"}
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {role.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveRole(role.id)}
                  />
                </Badge>
              ))}
            </div>

            {errors.roleIds && (
              <p className="text-sm text-red-600">{errors.roleIds.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 