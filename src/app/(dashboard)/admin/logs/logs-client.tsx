"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logsColumns, type ActivityLog } from "@/components/tables/logs-columns";

interface LogsResponse {
  logs: ActivityLog[];
}

export function LogsClient() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, typeFilter, userFilter]);

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/logs");
      if (!response.ok) throw new Error("Error al cargar logs");

      const data: LogsResponse = await response.json();
      setLogs(data.logs);
      setFilteredLogs(data.logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Filtro por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.type === typeFilter);
    }

    // Filtro por usuario
    if (userFilter !== "all") {
      filtered = filtered.filter((log) => log.user.id === userFilter);
    }

    setFilteredLogs(filtered);
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setUserFilter("all");
  };

  // Obtener lista única de usuarios
  const uniqueUsers = Array.from(
    new Map(logs.map((log) => [log.user.id, log.user])).values()
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logs del Sistema</h2>
          <p className="text-muted-foreground">
            Historial de actividad del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredLogs.length} registros
          </span>
        </div>
      </div>

      {/* Filtros adicionales */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros Avanzados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por tipo */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
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

            {/* Filtro por usuario */}
            <Select value={userFilter} onValueChange={setUserFilter}>
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

            {/* Limpiar filtros */}
            {(typeFilter !== "all" || userFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* DataTable de Logs */}
      <DataTable
        columns={logsColumns}
        data={filteredLogs}
        searchKey="action"
        searchPlaceholder="Buscar en logs..."
      />
    </div>
  );
}
