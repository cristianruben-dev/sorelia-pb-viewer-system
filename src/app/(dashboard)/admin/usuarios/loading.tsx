import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function UsuariosLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[140px]" />
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 space-y-4">
            {/* Barra de búsqueda */}
            <Skeleton className="h-10 w-full max-w-sm" />

            {/* Filas de usuarios */}
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-3 w-[220px]" />
                    </div>
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                    <Skeleton className="h-6 w-[70px] rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-end gap-2 pt-4">
              <Skeleton className="h-9 w-[90px]" />
              <Skeleton className="h-9 w-[90px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

