import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";

const createDashboardSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  iframeHtml: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const dashboards = await prisma.powerBIContent.findMany({
      include: {
        _count: {
          select: {
            userAccess: true,
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

    const dashboard = await prisma.powerBIContent.create({
      data: {
        title: validatedData.title,
        iframeHtml: validatedData.iframeHtml || "",
      },
      include: {
        _count: {
          select: {
            userAccess: true,
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