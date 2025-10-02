import { NextResponse } from "next/server";
import { getSystemConfig } from "@/lib/system-config";

// API pública para obtener configuración del sistema
export async function GET() {
  try {
    const config = await getSystemConfig();

    return NextResponse.json({ config });
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json(
      {
        config: {
          site_title: "Sistema Visualizador",
          site_logo: "",
          site_favicon: "",
        }
      },
      { status: 200 }
    );
  }
}

