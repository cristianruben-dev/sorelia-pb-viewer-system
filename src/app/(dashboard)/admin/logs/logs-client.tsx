"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { logsColumns, type ActivityLog } from "@/components/tables/logs-columns";
import { LogsFilters } from "@/components/logs/logs-filters";

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

      const data = await response.json();
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

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Cargando logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Logs del Sistema</h2>
        <p className="text-muted-foreground">
          Historial de actividad del sistema
        </p>
      </div>

      {/* Filtros */}
      <LogsFilters
        logs={logs}
        typeFilter={typeFilter}
        userFilter={userFilter}
        filteredCount={filteredLogs.length}
        onTypeFilterChange={setTypeFilter}
        onUserFilterChange={setUserFilter}
        onClearFilters={clearFilters}
      />

      {/* DataTable de Logs */}
      <Card>
        <CardContent>
          <DataTable
            columns={logsColumns}
            data={filteredLogs}
            searchKey="action"
            searchPlaceholder="Buscar en logs..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
