"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";
import type { User } from "@prisma/client";

interface ReportUsersManagerProps {
  reportId: string;
  reportTitle: string;
}

type UserBasic = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export function ReportUsersManager({ reportId, reportTitle }: ReportUsersManagerProps) {
  const [allUsers, setAllUsers] = useState<UserBasic[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [reportId]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Cargar todos los usuarios
      const usersResponse = await fetch('/api/admin/users');
      if (!usersResponse.ok) throw new Error('Error al cargar usuarios');
      const users = await usersResponse.json();

      // Filtrar solo usuarios activos y no admins (los admins tienen acceso a todo)
      const filteredUsers = users.filter((u: any) => u.active && !u.role.includes('admin'));
      setAllUsers(filteredUsers);

      // Cargar usuarios con acceso al reporte
      const reportUsersResponse = await fetch(`/api/admin/powerbi/${reportId}/users`);
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
  };

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

      const response = await fetch(`/api/admin/powerbi/${reportId}/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUserIds }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success('Accesos actualizados', {
        description: `Se actualizaron los accesos para "${reportTitle}"`
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error al guardar', {
        description: 'No se pudieron actualizar los accesos'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <CardTitle>Control de Acceso</CardTitle>
        </div>
        <CardDescription>
          Selecciona los usuarios que pueden ver este reporte. Los administradores tienen acceso a todos los reportes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay usuarios disponibles para asignar
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between border-b pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                type="button"
              >
                {selectedUserIds.length === allUsers.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedUserIds.length} de {allUsers.length} seleccionados
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleToggleUser(user.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleUser(user.id);
                    }
                  }}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={selectedUserIds.includes(user.id)}
                  aria-label={`Asignar acceso a ${user.name}`}
                >
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={() => handleToggleUser(user.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {user.role !== 'user' && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {user.role}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

