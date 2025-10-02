"use client";

import { usePathname } from "next/navigation";
import { Users, BarChart3, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AdminNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin/usuarios") return pathname === path || pathname === "/admin";
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      href: "/admin/usuarios",
      label: "Usuarios",
      icon: Users,
    },
    {
      href: "/admin/dashboards",
      label: "Dashboards",
      icon: BarChart3,
    },
    {
      href: "/admin/logs",
      label: "Logs",
      icon: FileText,
    },
    {
      href: "/admin/configuracion",
      label: "Configuración",
      icon: Settings,
    },
  ];

  return (
    <div className="flex gap-2 border-b pb-4 overflow-x-auto">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Button
            key={item.href}
            variant={active ? "default" : "ghost"}
            asChild
            className={cn(
              "flex items-center gap-2",
              active && "bg-primary text-primary-foreground"
            )}
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
} 