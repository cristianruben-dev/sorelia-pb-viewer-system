"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IPAddressPopover } from "@/components/logs/ip-address-popover";

interface User {
  id: string;
  name: string;
  email: string;
}

export interface ActivityLog {
  id: string;
  type: string;
  action: string;
  success: boolean | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: User;
  report: {
    id: string;
    title: string;
  } | null;
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    login: "Inicio de Sesión",
    logout: "Cierre de Sesión",
    report_access: "Acceso a Reporte",
  };
  return labels[type] || type;
};

const getTypeBadgeVariant = (type: string) => {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    login: "default",
    logout: "secondary",
    report_access: "outline",
  };
  return variants[type] || "outline";
};

export const logsColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha y Hora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="whitespace-nowrap">
          {date.toLocaleString("es-MX", {
            dateStyle: "short",
            timeStyle: "medium",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usuario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant={getTypeBadgeVariant(type)}>
          {getTypeLabel(type)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => {
      const log = row.original;
      return (
        <div className="flex items-center gap-2">
          {log.action}
          {log.type === "login" && log.success !== null && (
            <Badge
              variant={log.success ? "default" : "destructive"}
              className="text-xs"
            >
              {log.success ? "Exitoso" : "Fallido"}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "report.title",
    header: "Detalles",
    cell: ({ row }) => {
      const report = row.original.report;
      if (!report) return "—";
      return (
        <div className="text-sm">
          <span className="text-muted-foreground">Reporte: </span>
          {report.title}
        </div>
      );
    },
  },
  {
    accessorKey: "ipAddress",
    header: "IP",
    cell: ({ row }) => {
      const ip = row.getValue("ipAddress") as string | null;
      if (!ip) {
        return <div className="text-sm text-muted-foreground">—</div>;
      }
      return <IPAddressPopover ipAddress={ip} />;
    },
  },
];


