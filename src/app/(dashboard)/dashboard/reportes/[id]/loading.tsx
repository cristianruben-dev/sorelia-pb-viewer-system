import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ReporteLoading() {
  return (
    <div className="space-y-6">
      {/* Header del reporte */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[350px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Contenido del reporte */}
      <Card>
        <CardContent className="p-0">
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}

