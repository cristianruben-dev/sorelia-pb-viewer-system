"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Activity, X } from "lucide-react";
import type { ActivityLog } from "@/components/tables/logs-columns";
import { Label } from "../ui/label";

interface LogsFiltersProps {
  logs: ActivityLog[];
  typeFilter: string;
  userFilter: string;
  filteredCount: number;
  onTypeFilterChange: (value: string) => void;
  onUserFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export function LogsFilters({
  logs,
  typeFilter,
  userFilter,
  filteredCount,
  onTypeFilterChange,
  onUserFilterChange,
  onClearFilters,
}: LogsFiltersProps) {
  // Obtener lista única de usuarios
  const uniqueUsers = Array.from(
    new Map(logs.map((log) => [log.user.id, log.user])).values()
  );

  const hasActiveFilters = typeFilter !== "all" || userFilter !== "all";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredCount} {filteredCount === 1 ? "registro" : "registros"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Filtro por tipo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Actividad</Label>
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de actividad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="login">Inicio de Sesión</SelectItem>
                <SelectItem value="logout">Cierre de Sesión</SelectItem>
                <SelectItem value="report_access">Acceso a Reporte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por usuario */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Usuario</Label>
            <Select value={userFilter} onValueChange={onUserFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los usuarios</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
