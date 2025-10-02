"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut();
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