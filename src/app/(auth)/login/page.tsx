import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { SystemLogo } from "@/components/system-logo";

export default function LoginPage() {
	return (
		<main className="p-4">
			<div className="flex items-center justify-center mb-10">
				<SystemLogo />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-primary">
						Iniciar Sesión
					</CardTitle>
					<CardDescription className="text-muted-foreground">
						Ingresa tus credenciales para acceder a tu cuenta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</main>
	);
}
