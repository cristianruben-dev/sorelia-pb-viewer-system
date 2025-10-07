"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { createDashboardColumns } from "@/components/tables/dashboard-columns";
import type { PowerBIContent } from "@prisma/client";
import { useRouter } from "next/navigation";

type DashboardWithCounts = PowerBIContent & {
  _count: {
    userAccess: number;
  };
};

interface DashboardsClientProps {
  dashboards: DashboardWithCounts[];
}

export function DashboardsClient({ dashboards }: DashboardsClientProps) {
  const router = useRouter();

  const handleDelete = () => {
    router.refresh();
  };

  const handleUpdate = () => {
    router.refresh();
  };

  const columns = createDashboardColumns(handleDelete, handleUpdate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboards</h2>
          <p className="text-muted-foreground">
            Gestiona los dashboards de Power BI
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboards/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Dashboard
          </Link>
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={dashboards}
        searchKey="title"
        searchPlaceholder="Buscar dashboards..."
      />
    </div>
  );
}


