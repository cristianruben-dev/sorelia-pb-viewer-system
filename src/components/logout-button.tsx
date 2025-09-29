"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Sesión cerrada", {
        description: "Has cerrado sesión correctamente"
      });
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error al cerrar sesión", {
        description: "Ha ocurrido un error inesperado"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className={cn("flex items-center", className)}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Cerrar Sesión
    </Button>
  );
} 