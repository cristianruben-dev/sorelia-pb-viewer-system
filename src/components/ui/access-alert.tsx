import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessAlertProps {
  hasAccess: boolean;
  accessMessage?: string;
  noAccessMessage?: string;
  upgradeLink?: string;
  className?: string;
}

export function AccessAlert({
  hasAccess,
  accessMessage = "✓ Tienes acceso a este contenido",
  noAccessMessage = "Acceso Premium Requerido",
  upgradeLink = "/#pricing",
  className
}: AccessAlertProps) {
  if (hasAccess) {
    return (
      <div className={cn(
        "p-4 bg-green-50 border border-green-200 rounded-lg",
        className
      )}>
        <p className="text-green-800 font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {accessMessage}
        </p>
        <p className="text-green-700 text-sm mt-1">
          Puedes acceder a todo el contenido disponible.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 bg-amber-50 border border-amber-200 rounded-lg",
      className
    )}>
      <p className="text-amber-800 font-medium flex items-center gap-2">
        <Lock className="h-4 w-4" />
        {noAccessMessage}
      </p>
      <p className="text-amber-700 text-sm mt-1">
        Este contenido requiere una suscripción premium para acceder.
      </p>
      <div className="mt-3">
        <Button asChild size="sm">
          <Link href={upgradeLink}>
            Actualizar Plan
          </Link>
        </Button>
      </div>
    </div>
  );
} 