import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { prisma } from "@/lib/prisma";
import { isUserAdmin } from '@/lib/access-control';
import { z } from 'zod';

const assignUsersSchema = z.object({
  userIds: z.array(z.string()),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Obtener usuarios con acceso al reporte
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id: reportId } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Verificar que el reporte existe
    const report = await prisma.powerBIContent.findUnique({
      where: { id: reportId },
      include: {
        userAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    return NextResponse.json(report.userAccess.map(access => access.user));
  } catch (error) {
    console.error('Error fetching report users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT: Asignar usuarios al reporte (reemplaza los existentes)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id: reportId } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = assignUsersSchema.parse(body);

    // Verificar que el reporte existe
    const report = await prisma.powerBIContent.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    // Eliminar accesos existentes
    await prisma.userReportAccess.deleteMany({
      where: { reportId },
    });

    // Crear nuevos accesos
    if (validatedData.userIds.length > 0) {
      await prisma.userReportAccess.createMany({
        data: validatedData.userIds.map(userId => ({
          userId,
          reportId,
        })),
        skipDuplicates: true,
      });
    }

    // Obtener el reporte actualizado con los usuarios
    const updatedReport = await prisma.powerBIContent.findUnique({
      where: { id: reportId },
      include: {
        userAccess: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error assigning users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

