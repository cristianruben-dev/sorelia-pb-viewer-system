"use client";

import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BarChart3, FileText, Settings } from "lucide-react";
import Link from "next/link";

export function AdminNavigation() {
  const pathname = usePathname();

  let activeTab = "usuarios";
  if (pathname.includes("/admin/dashboards")) {
    activeTab = "dashboards";
  } else if (pathname.includes("/admin/logs")) {
    activeTab = "logs";
  } else if (pathname.includes("/admin/configuracion")) {
    activeTab = "configuracion";
  } else if (pathname.includes("/admin/usuarios")) {
    activeTab = "usuarios";
  }

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsList className="grid w-fit grid-cols-4">
        <TabsTrigger value="usuarios" asChild>
          <Link href="/admin/usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuarios
          </Link>
        </TabsTrigger>
        <TabsTrigger value="dashboards" asChild>
          <Link href="/admin/dashboards" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboards
          </Link>
        </TabsTrigger>
        <TabsTrigger value="logs" asChild>
          <Link href="/admin/logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs
          </Link>
        </TabsTrigger>
        <TabsTrigger value="configuracion" asChild>
          <Link href="/admin/configuracion" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 