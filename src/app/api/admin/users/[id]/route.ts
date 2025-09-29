import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import { isUserAdmin } from '@/lib/access-control';

const updateUserSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  email: z.string().email('Email inválido').optional(),
  roleId: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(targetUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Si se está actualizando el email, verificar que no existe
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Ya existe un usuario con ese email' },
          { status: 400 }
        );
      }
    }

    // Actualizar datos básicos del usuario
    const updateData: any = {};
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id },
        data: updateData,
      });
    }

    // Si se está actualizando el rol
    if (validatedData.roleId) {
      // Verificar que el rol existe
      const role = await prisma.role.findUnique({
        where: { id: validatedData.roleId },
      });

      if (!role) {
        return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
      }

      // Eliminar roles existentes y asignar el nuevo
      await prisma.userRole.deleteMany({
        where: { userId: id },
      });

      await prisma.userRole.create({
        data: {
          userId: id,
          roleId: validatedData.roleId,
        },
      });
    }

    // Obtener el usuario actualizado
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // No permitir que un admin se elimine a sí mismo
    if (id === user.id) {
      return NextResponse.json(
        { error: 'No puedes eliminarte a ti mismo' },
        { status: 400 }
      );
    }

    // Eliminar el usuario (esto eliminará en cascada las relaciones)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 