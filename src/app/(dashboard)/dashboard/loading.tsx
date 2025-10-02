import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-[70%]" />
            {/* Preview del dashboard */}
            <Skeleton className="h-32 w-full mt-4 rounded-lg" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-end">
              <Skeleton className="h-9 w-[130px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
