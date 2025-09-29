import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, BarChart3, Settings, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { isUserAdmin, getBadgeVariant } from "@/lib/access-control";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

export default async function DashboardsAdminPage() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    redirect("/dashboard");
  }

  const dashboards = await db.powerBIContent.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button asChild>
          <Link href="/admin/dashboards/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Dashboard
          </Link>
        </Button>
      </div>

      {/* Dashboards Table */}
      {dashboards.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No hay dashboards"
          description="Comienza creando tu primer dashboard de Power BI"
          action={
            <Button asChild>
              <Link href="/admin/dashboards/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Crear Dashboard
              </Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dashboards</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Roles de Acceso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboards.map((dashboard) => (
                  <TableRow key={dashboard.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium">{dashboard.title}</div>
                          {dashboard.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {dashboard.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {dashboard.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{dashboard.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {dashboard.roles.length > 0 ? (
                          dashboard.roles.map((roleRelation) => (
                            <Badge
                              key={roleRelation.role.id}
                              variant={getBadgeVariant(roleRelation.role.name)}
                              className="text-xs"
                            >
                              {roleRelation.role.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Sin roles
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={dashboard.published ? "default" : "secondary"}>
                        {dashboard.published ? "Publicado" : "Borrador"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(dashboard.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {dashboard.published && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/reportes/${dashboard.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/dashboards/${dashboard.id}/editar`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 