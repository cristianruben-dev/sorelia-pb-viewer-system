import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-4 w-[320px]" />
        </div>
        <Skeleton className="h-10 w-[160px]" />
      </div>

      {/* Tabla de dashboards */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 space-y-4">
            {/* Barra de búsqueda */}
            <Skeleton className="h-10 w-full max-w-sm" />

            {/* Filas de dashboards */}
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-6 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-6 w-[120px] rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
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

