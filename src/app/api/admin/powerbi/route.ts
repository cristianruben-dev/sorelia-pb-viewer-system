import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";

const createDashboardSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  tags: z.array(z.string()).optional(),
  roleIds: z.array(z.string()).min(1, "Debe seleccionar al menos un rol"),
  iframeHtml: z.string().optional(),
  published: z.boolean().default(false),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const dashboards = await prisma.powerBIContent.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(dashboards);
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createDashboardSchema.parse(body);

    // Verificar que todos los roles existen
    const roles = await prisma.role.findMany({
      where: { id: { in: validatedData.roleIds } },
    });

    if (roles.length !== validatedData.roleIds.length) {
      return NextResponse.json({ error: "Uno o más roles no encontrados" }, { status: 404 });
    }

    const dashboard = await prisma.powerBIContent.create({
      data: {
        title: validatedData.title,
        tags: validatedData.tags || [],
        iframeHtml: validatedData.iframeHtml || "",
        published: validatedData.published,
        roles: {
          create: validatedData.roleIds.map(roleId => ({
            roleId,
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(dashboard);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating dashboard:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 