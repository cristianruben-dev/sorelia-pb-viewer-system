"use client";

import { useState } from "react";
import type { User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, ChevronDown } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserSettingsDialog } from "./user-settings-dialog";

export function UserDropdown({ user }: { user: User }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 border border-border p-6">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex md:flex-col md:items-start md:text-left">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowSettings(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Ajustes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowLogoutConfirm(true)}
            className="text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres cerrar tu sesión? Tendrás que iniciar
              sesión nuevamente para acceder al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserSettingsDialog
        user={user}
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </>
  );
}

