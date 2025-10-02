import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { isUserAdmin } from "@/lib/access-control";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const configs = await prisma.systemConfig.findMany();

    // Convertir array a objeto para facilitar uso
    const configObj: Record<string, string> = {};
    configs.forEach((config) => {
      configObj[config.key] = config.value;
    });

    return NextResponse.json({ config: configObj });
  } catch (error) {
    console.error("Error fetching config:", error);
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

    const { key, value } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "La clave es requerida" },
        { status: 400 }
      );
    }

    const config = await prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error("Error updating config:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}


