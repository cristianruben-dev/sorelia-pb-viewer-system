import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  // Redirigir automáticamente a la sección de usuarios
  redirect("/admin/usuarios");
} 