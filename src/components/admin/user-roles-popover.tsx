"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import type { Role } from "@prisma/client";
import type { UserWithRoles } from "@/lib/access-control";

interface UserRolesPopoverProps {
	user: UserWithRoles;
	onRolesUpdated: () => void;
}

export function UserRolesPopover({
	user,
	onRolesUpdated,
}: UserRolesPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [allRoles, setAllRoles] = useState<Role[]>([]);
	const [userRoles, setUserRoles] = useState<Role[]>(
		user.roles.map((ur) => ur.role),
	);

	useEffect(() => {
		if (isOpen) {
			fetch("/api/admin/roles")
				.then((res) => res.json())
				.then((data) => setAllRoles(data))
				.catch((error) => {
					toast.error("Error al cargar roles", {
						description: "No se pudieron cargar los roles disponibles",
					});
				});
		}
	}, [isOpen]);

	// Actualizar roles del usuario cuando cambie el prop
	useEffect(() => {
		setUserRoles(user.roles.map((ur) => ur.role));
	}, [user.roles]);

	// Obtener roles disponibles para agregar (que no tenga el usuario)
	const availableRoles = allRoles.filter(
		(role) => !userRoles.some((userRole) => userRole.id === role.id),
	);

	const handleAddRole = async (roleId: string) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/admin/users/roles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: user.id,
					roleId: roleId,
				}),
			});

			if (!response.ok) {
				toast.error("Error al agregar rol", {
					description: "No se pudo agregar el rol al usuario",
				});
				throw new Error("Error al agregar rol");
			}

			// Actualizar la lista local
			const roleToAdd = allRoles.find((r) => r.id === roleId);
			if (roleToAdd) {
				setUserRoles([...userRoles, roleToAdd]);
				toast.success("Rol agregado", {
					description: `Se agregó el rol ${roleToAdd.name} al usuario ${user.name}`,
				});
			}

			onRolesUpdated();
		} catch (error) {
			if (
				!(
					error instanceof Error &&
					error.message.includes("Error al agregar rol")
				)
			) {
				toast.error("Error inesperado", {
					description: "Ha ocurrido un error al agregar el rol",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveRole = async (roleId: string) => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/admin/users/roles/${user.id}/${roleId}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				toast.error("Error al eliminar rol", {
					description: "No se pudo eliminar el rol del usuario",
				});
				throw new Error("Error al eliminar rol");
			}

			// Actualizar la lista local
			const roleToRemove = userRoles.find((role) => role.id === roleId);
			setUserRoles(userRoles.filter((role) => role.id !== roleId));

			if (roleToRemove) {
				toast.success("Rol eliminado", {
					description: `Se eliminó el rol ${roleToRemove.name} del usuario ${user.name}`,
				});
			}

			onRolesUpdated();
		} catch (error) {
			console.error("Error removing role:", error);
			// Solo mostrar toast si no se mostró antes
			if (
				!(
					error instanceof Error &&
					error.message.includes("Error al eliminar rol")
				)
			) {
				toast.error("Error inesperado", {
					description: "Ha ocurrido un error al eliminar el rol",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm">
					<Plus className="h-4 w-4 mr-1" />
					Agregar Roles
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="space-y-4">
					<div>
						<h4 className="font-medium text-sm mb-2">Roles Actuales</h4>
						<div className="flex flex-wrap gap-1">
							{userRoles.length === 0 ? (
								<Badge variant="outline">Sin roles</Badge>
							) : (
								userRoles.map((role) => (
									<Badge
										key={role.id}
										variant={role.isAdmin ? "destructive" : "secondary"}
										className="flex items-center gap-1"
									>
										{role.name}
										<X
											className="h-3 w-3 cursor-pointer"
											onClick={() => handleRemoveRole(role.id)}
										/>
									</Badge>
								))
							)}
						</div>
					</div>

					{availableRoles.length > 0 && (
						<div>
							<h4 className="font-medium text-sm mb-2">Roles Disponibles</h4>
							<div className="flex flex-wrap gap-1">
								{availableRoles.map((role) => (
									<Badge
										key={role.id}
										variant="outline"
										className="cursor-pointer hover:bg-muted"
										onClick={() => handleAddRole(role.id)}
									>
										{role.name}
										{role.isAdmin && (
											<span className="text-xs text-red-600 ml-1">(Admin)</span>
										)}
									</Badge>
								))}
							</div>
						</div>
					)}

					<div className="flex justify-end">
						<Button
							size="sm"
							onClick={() => setIsOpen(false)}
							disabled={isLoading}
						>
							Cerrar
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
