import { getCurrentUser } from "@/lib/auth-server";
import { filterAccessibleReports } from "@/lib/access-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";

import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const reports = await filterAccessibleReports(user);

  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-muted-foreground">
          No hay reportes disponibles en este momento.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="group hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{report.title}</CardTitle>
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
            <div className="flex items-center justify-end">
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
  );
} 