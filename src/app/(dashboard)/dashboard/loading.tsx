import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      {/* PowerBI reports grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((index) => (
          <Card key={`powerbi-${index}`} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  {/* Title skeleton */}
                  <Skeleton className="h-6 w-3/4" />

                  {/* Badges skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Dashboard preview skeleton */}
              <div className="mt-4">
                <Skeleton className="w-full h-40 rounded" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Metadata skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>

                {/* Separator line */}
                <div className="h-px bg-border" />

                {/* Button skeleton */}
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 