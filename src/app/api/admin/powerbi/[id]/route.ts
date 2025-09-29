import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";

const updateDashboardSchema = z.object({
  title: z.string().min(1, "El título es requerido").optional(),
  tags: z.array(z.string()).optional(),
  roleIds: z.array(z.string()).optional(),
  iframeHtml: z.string().optional(),
  published: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const dashboard = await prisma.powerBIContent.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!dashboard) {
      return NextResponse.json({ error: "Dashboard no encontrado" }, { status: 404 });
    }

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateDashboardSchema.parse(body);

    // Verificar que el dashboard existe
    const existingDashboard = await prisma.powerBIContent.findUnique({
      where: { id },
    });

    if (!existingDashboard) {
      return NextResponse.json({ error: "Dashboard no encontrado" }, { status: 404 });
    }

    // Si se están actualizando los roles, verificar que todos existen
    if (validatedData.roleIds) {
      const roles = await prisma.role.findMany({
        where: { id: { in: validatedData.roleIds } },
      });

      if (roles.length !== validatedData.roleIds.length) {
        return NextResponse.json({ error: "Uno o más roles no encontrados" }, { status: 404 });
      }
    }

    // Preparar datos para actualización
    const updateData: any = {};

    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;
    if (validatedData.iframeHtml !== undefined) updateData.iframeHtml = validatedData.iframeHtml;
    if (validatedData.published !== undefined) updateData.published = validatedData.published;

    // Si se están actualizando los roles, manejar la relación
    if (validatedData.roleIds !== undefined) {
      updateData.roles = {
        // Eliminar todas las relaciones existentes
        deleteMany: {},
        // Crear las nuevas relaciones
        create: validatedData.roleIds.map(roleId => ({
          roleId,
        })),
      };
    }

    const updatedDashboard = await prisma.powerBIContent.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDashboard);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating dashboard:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Verificar que el dashboard existe
    const existingDashboard = await prisma.powerBIContent.findUnique({
      where: { id },
    });

    if (!existingDashboard) {
      return NextResponse.json({ error: "Dashboard no encontrado" }, { status: 404 });
    }

    await prisma.powerBIContent.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Dashboard eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 