"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Home, Menu, Layout, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { UserWithRoles } from "@/lib/access-control";
import Image from "next/image";

interface DashboardNavProps {
  user: UserWithRoles;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const userIsAdmin = user.roles.some(role => role.role.isAdmin);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Sesión cerrada", {
        description: "Has cerrado sesión correctamente"
      });
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error al cerrar sesión", {
        description: "Ha ocurrido un error inesperado"
      });
    }
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    ...(userIsAdmin ? [
      {
        title: "Panel Admin",
        href: "/admin/usuarios",
        icon: Layout,
      }
    ] : [])
  ];

  return (
    <nav className="bg-white border-b border-gray-200 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <Image
              src="/logo-kepler.avif"
              alt="Logo Sorelia"
              width={200}
              height={50}
            />

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-4">
              {navItems.map((item) => {
                // Para admin, consideramos activo si la ruta actual es /admin/* 
                const isActive = item.href === "/admin/usuarios"
                  ? pathname.startsWith("/admin")
                  : pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Info and Logout - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="mr-4 text-sm">
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
            <LogoutButton />
          </div>

          {/* Mobile menu dropdown */}
          <div className="flex items-center md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {navItems.map((item) => {
                  const isActive = item.href === "/admin/usuarios"
                    ? pathname.startsWith("/admin")
                    : pathname === item.href;

                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}