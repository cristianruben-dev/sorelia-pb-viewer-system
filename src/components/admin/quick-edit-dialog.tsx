"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuickEditDialogProps {
	title: string;
	initialPublished: boolean;
	initialAccessLevel: string;
	onSave: (data: { published: boolean; accessLevel: string }) => Promise<void>;
	triggerText?: string;
}

export function QuickEditDialog({
	title,
	initialPublished,
	initialAccessLevel,
	onSave,
	triggerText,
}: QuickEditDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [published, setPublished] = useState(initialPublished);
	const [accessLevel, setAccessLevel] = useState(initialAccessLevel);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await onSave({ published, accessLevel });
			toast.success("Configuración actualizada", {
				description: `Se actualizó la configuración de "${title}" correctamente`,
			});
			setIsOpen(false);
		} catch (error) {
			toast.error("Error al guardar cambios", {
				description: "No se pudieron guardar los cambios realizados",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			// Resetear valores al cerrar sin guardar
			setPublished(initialPublished);
			setAccessLevel(initialAccessLevel);
		}
		setIsOpen(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Settings className="h-4 w-4" />
					{triggerText && <span className="ml-2">{triggerText}</span>}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Configuración Rápida</DialogTitle>
					<DialogDescription>
						Edita la configuración básica de "{title}"
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="published">Estado de Publicación</Label>
								<p className="text-sm text-muted-foreground">
									Controla si el contenido es visible para los usuarios
								</p>
							</div>
							<Switch
								id="published"
								checked={published}
								onCheckedChange={setPublished}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="accessLevel">Nivel de Acceso</Label>
							<Select value={accessLevel} onValueChange={setAccessLevel}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="FREE">Gratuito</SelectItem>
									<SelectItem value="FREEMIUM">Freemium</SelectItem>
									<SelectItem value="PREMIUM">Premium</SelectItem>
									<SelectItem value="PREMIUM_PLUS">Premium Plus</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								{accessLevel === "FREE" && "Accesible para todos los usuarios"}
								{accessLevel === "FREEMIUM" &&
									"Accesible para usuarios registrados"}
								{accessLevel === "PREMIUM" && "Requiere suscripción Premium"}
								{accessLevel === "PREMIUM_PLUS" &&
									"Requiere suscripción Premium Plus"}
							</p>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsOpen(false)}
						disabled={isSaving}
					>
						Cancelar
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Guardando...
							</>
						) : (
							"Guardar"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
