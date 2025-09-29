"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function ErrorComponent({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Card className="max-w-md w-full bg-gradient-to-br from-puerto-rico-100/40 to-cream-100/40">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Algo salió mal</CardTitle>
          <CardDescription>
            Ha ocurrido un error inesperado. Puedes intentar recargar la página.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          <div className="space-y-3">
            <Button onClick={reset} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>

            <Button asChild variant="outline" className="w-full">
              <a href="/">
                <Home className="mr-2 h-4 w-4" />
                Ir al Inicio
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 