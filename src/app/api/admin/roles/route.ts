import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import { isUserAdmin } from '@/lib/access-control';

const createRoleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').regex(/^[A-Z_]+$/, 'Solo letras mayúsculas y guiones bajos'),
  isAdmin: z.boolean().default(false),
});

const updateRoleSchema = createRoleSchema.partial();

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: {
            userRoles: true,
            powerBIContentRoles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const rolesWithCounts = roles.map((role) => ({
      ...role,
      users: role._count.userRoles,
      powerBIContents: role._count.powerBIContentRoles,
    }));

    return NextResponse.json(rolesWithCounts);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createRoleSchema.parse(body);

    // Verificar que el nombre del rol no existe
    const existingRole = await prisma.role.findUnique({
      where: { name: validatedData.name },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Ya existe un rol con ese nombre' },
        { status: 400 }
      );
    }

    const newRole = await prisma.role.create({
      data: {
        name: validatedData.name,
        isAdmin: validatedData.isAdmin,
      },
      include: {
        _count: {
          select: {
            userRoles: true,
            powerBIContentRoles: true,
          },
        },
      },
    });

    const roleWithCounts = {
      ...newRole,
      users: newRole._count.userRoles,
      powerBIContents: newRole._count.powerBIContentRoles,
    };

    return NextResponse.json(roleWithCounts);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 