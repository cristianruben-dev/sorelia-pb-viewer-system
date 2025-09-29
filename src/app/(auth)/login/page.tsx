import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="p-4">
      <Image
        src="/logo-kepler.avif"
        alt="Logo Sorelia"
        width={300}
        height={100}
        className="mb-10 mx-auto"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Iniciar Sesión</CardTitle>
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