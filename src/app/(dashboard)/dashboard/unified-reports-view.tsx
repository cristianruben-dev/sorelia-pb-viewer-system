import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Eye, Search, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { UserWithRoles } from "@/lib/access-control";
import type { PowerBIContent, Role } from "@prisma/client";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import { getBadgeVariant, type PowerBIContentWithRoles } from "@/lib/access-control";

type PowerBIContentWithRole = PowerBIContent & {
  role: Role | null;
};

interface UnifiedReportsViewProps {
  reports: PowerBIContentWithRoles[];
}

export function UnifiedReportsView({ reports }: UnifiedReportsViewProps) {
  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No hay reportes disponibles en este momento.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
              </div>
              {/* Previsualización del Dashboard */}
              <div className="mt-4">
                <DashboardPreview
                  dashboardId={report.id}
                  iframeHtml={report.iframeHtml}
                  hasAccess={true}
                  size="medium"
                  className="w-full"
                />
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {report.tags && report.tags.length > 0 && (
                    report.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  )}
                </div>

                <Button asChild size="sm">
                  <Link href={`/dashboard/reportes/${report.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Reporte
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
