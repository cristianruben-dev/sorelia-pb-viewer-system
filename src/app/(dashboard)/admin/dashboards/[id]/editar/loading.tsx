import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
      </div>

      {/* Form skeleton */}
      <div className="w-full mx-auto p-6">
        <div className="space-y-6">
          {/* Dashboard Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-80" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Description field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full" />
              </div>

              {/* Iframe HTML field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-3 w-96" />
              </div>

              {/* Category field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Access Level and Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-16" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-72" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((index) => (
                  <Skeleton key={index} className="h-6 w-20" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-96" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-80 rounded" />
              <Skeleton className="h-3 w-full mt-2" />
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
} 