import { getCurrentUser } from "@/lib/auth-server";
import { filterAccessibleReports } from "@/lib/access-control";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const reports = await filterAccessibleReports(user);

  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-muted-foreground py-12">
          No hay reportes disponibles en este momento.
        </CardContent>
      </Card>
    );
  }

  return <DashboardView reports={reports} />;
} 