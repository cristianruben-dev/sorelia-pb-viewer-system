import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracionLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-[300px]" />
          </div>
        </CardContent>
      </Card>

      {/* Logotipo */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-4 w-[380px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[80px] w-[200px] rounded-lg" />
          <Skeleton className="h-10 w-full max-w-md" />
        </CardContent>
      </Card>

      {/* Favicon */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-4 w-[400px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-10 w-full max-w-md" />
        </CardContent>
      </Card>

      {/* Botón */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[180px]" />
      </div>
    </div>
  );
}

