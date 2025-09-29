import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Card className="max-w-md w-full bg-gradient-to-br from-puerto-rico-100/40 to-cream-100/40">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 w-fit rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Página no encontrada</CardTitle>
          <CardDescription>
            La página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ir al Inicio
              </Link>
            </Button>
          </div>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Error 404 - Página no encontrada
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 