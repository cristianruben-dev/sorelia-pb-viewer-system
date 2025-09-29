import { getCurrentUser } from "@/lib/auth-server";
import { filterAccessibleReports } from "@/lib/access-control";
import { UnifiedReportsView } from "./unified-reports-view";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const accessibleReports = await filterAccessibleReports(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Principal</h1>
      </div>

      <UnifiedReportsView reports={accessibleReports} />
    </div>
  );
} 