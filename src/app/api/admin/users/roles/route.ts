import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from '@/lib/auth-server';
import { isUserAdmin } from '@/lib/access-control';

import { z } from 'zod';

const assignRoleSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
  roleId: z.string().min(1, 'El ID de rol es requerido'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = assignRoleSchema.parse(body);

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el rol existe
    const role = await prisma.role.findUnique({
      where: { id: validatedData.roleId },
    });

    if (!role) {
      return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
    }

    // Verificar si la relación ya existe
    const existingRelation = await prisma.userRole.findFirst({
      where: {
        userId: validatedData.userId,
        roleId: validatedData.roleId,
      },
    });

    if (existingRelation) {
      return NextResponse.json(
        { error: 'El usuario ya tiene asignado este rol' },
        { status: 400 }
      );
    }

    // Crear la relación usuario-rol
    const userRole = await prisma.userRole.create({
      data: {
        userId: validatedData.userId,
        roleId: validatedData.roleId,
      },
      include: {
        role: true,
      },
    });

    return NextResponse.json(userRole);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error assigning role:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 