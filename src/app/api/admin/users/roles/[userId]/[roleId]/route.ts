import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth-server';
import { isUserAdmin } from '@/lib/access-control';

interface RouteParams {
  params: Promise<{ userId: string; roleId: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { userId, roleId } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Verificar que el usuario existe
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el rol existe
    const role = await db.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
    }

    // Buscar y eliminar la relación usuario-rol
    const userRole = await db.userRole.findFirst({
      where: {
        userId: userId,
        roleId: roleId,
      },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: 'El usuario no tiene asignado este rol' },
        { status: 400 }
      );
    }

    await db.userRole.delete({
      where: {
        id: userRole.id,
      },
    });

    return NextResponse.json({ message: 'Rol eliminado exitosamente' });
  } catch (error) {
    console.error('Error removing role:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 