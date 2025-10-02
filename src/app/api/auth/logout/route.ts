import { NextResponse } from "next/server";
import { getSessionToken, deleteSession, deleteSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    const token = await getSessionToken();

    if (token) {
      await deleteSession(token);
    }

    await deleteSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { error: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}

