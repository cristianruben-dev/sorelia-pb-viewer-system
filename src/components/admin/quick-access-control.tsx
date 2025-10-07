"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Users, UserPlus } from "lucide-react";
import type { User } from "@prisma/client";

interface QuickAccessControlProps {
  dashboardId: string;
  dashboardTitle: string;
  userCount: number;
  onUpdate?: () => void;
}

type UserBasic = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export function QuickAccessControl({ 
  dashboardId, 
  dashboardTitle, 
  userCount,
  onUpdate 
}: QuickAccessControlProps) {
  const [allUsers, setAllUsers] = useState<UserBasic[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Cargar todos los usuarios
      const usersResponse = await fetch('/api/admin/users');
      if (!usersResponse.ok) throw new Error('Error al cargar usuarios');
      const users = await usersResponse.json();

      // Filtrar solo usuarios activos y no admins
      const filteredUsers = users.filter((u: User) => u.active && !u.role.includes('admin'));
      setAllUsers(filteredUsers);

      // Cargar usuarios con acceso al reporte
      const reportUsersResponse = await fetch(`/api/admin/powerbi/${dashboardId}/users`);
      if (!reportUsersResponse.ok) throw new Error('Error al cargar accesos');
      const reportUsers = await reportUsersResponse.json();

      setSelectedUserIds(reportUsers.map((u: UserBasic) => u.id));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar datos', {
        description: 'No se pudieron cargar los usuarios'
      });
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === allUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(allUsers.map(u => u.id));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch(`/api/admin/powerbi/${dashboardId}/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success('Accesos actualizados', {
        description: `Se actualizaron los accesos para "${dashboardTitle}"`
      });

      setIsOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error al guardar', {
        description: 'No se pudieron actualizar los accesos'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <UserPlus className="h-4 w-4" />
          <Badge variant="outline" className="text-xs">
            {userCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <h4 className="font-medium">Control de Acceso</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestiona quién puede ver "{dashboardTitle}"
            </p>
          </div>

          <Separator />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : allUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay usuarios disponibles
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  type="button"
                >
                  {selectedUserIds.length === allUsers.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {selectedUserIds.length} de {allUsers.length}
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer w-full text-left"
                      onClick={() => handleToggleUser(user.id)}
                      aria-label={`Alternar acceso para ${user.name}`}
                    >
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleToggleUser(user.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      {user.role !== 'user' && (
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}