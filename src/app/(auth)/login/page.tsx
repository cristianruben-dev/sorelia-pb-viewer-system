'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { toast } from "sonner";

const loginSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const callbackUrl = "/dashboard";

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await signIn(data.email, data.password);

			if (result) {
				toast.success("¡Bienvenido!", {
					description: "Has iniciado sesión correctamente"
				});

				// Usar window.location para forzar la recarga completa
				window.location.href = callbackUrl;
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión. Inténtalo de nuevo.";
			setError(errorMessage);
			toast.error("Error al iniciar sesión", {
				description: errorMessage
			});
			setIsLoading(false);
		}
	};

	return (
		<main className="p-4">
			<Card className="shadow-2xl">
				<CardHeader>
					<CardTitle className="font-bold text-primary">
						Entrar
					</CardTitle>
					<CardDescription className="text-muted-foreground">
						Inicia sesión para acceder a los reportes BI
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
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Contraseña</Label>

							</div>
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

						<div className="flex items-center justify-end">
							<a
								href="/forgot-password"
								className="text-sm text-primary underline-offset-4 underline"
							>
								¿Olvidaste tu contraseña?
							</a>
						</div>

						<Button
							type="submit"
							className="w-full"
							variant="secondary"
							disabled={isLoading}
						>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}