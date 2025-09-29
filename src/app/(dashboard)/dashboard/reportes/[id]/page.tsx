import { getCurrentUser } from "@/lib/auth-server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canUserAccessReport } from "@/lib/access-control";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize } from "lucide-react";
import Link from "next/link";
import { FullscreenDashboard } from "@/components/dashboard/fullscreen-dashboard";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportePage({ params }: PageProps) {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const report = await prisma.powerBIContent.findUnique({
    where: { id: resolvedParams.id, published: true },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!report) {
    notFound();
  }

  // Verificar acceso
  const hasAccess = canUserAccessReport(user, report.roles);
  if (!hasAccess) {
    redirect("/dashboard");
  }

  // Procesar el HTML del iframe para asegurar que ocupe todo el ancho
  const processIframeHtml = (html: string) => {
    if (!html) return "";

    // Reemplazar los atributos de ancho y altura para ocupar todo el espacio
    return html
      .replace(/width="[^"]*"/g, 'width="100%"')
      .replace(/height="[^"]*"/g, 'height="100%"')
      .replace(/style="[^"]*"/g, 'style="width:100%;height:100%;border:none;"');
  };

  const processedIframeHtml = report.iframeHtml ? processIframeHtml(report.iframeHtml) : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{report.title}</h1>
          </div>
        </div>

        {report.iframeHtml && (
          <FullscreenDashboard
            iframeHtml={processedIframeHtml}
            title={report.title}
          >
            <Button variant="outline" size="sm">
              <Maximize className="h-4 w-4 mr-2" />
              Pantalla Completa
            </Button>
          </FullscreenDashboard>
        )}
      </div>

      {/* Reporte */}
      <div className="border rounded-lg overflow-hidden bg-white w-full">
        {processedIframeHtml ? (
          <div
            className="w-full h-[calc(100vh-200px)]"
            dangerouslySetInnerHTML={{ __html: processedIframeHtml }}
          />
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium">Reporte no disponible</h3>
              <p>Este reporte aún no tiene contenido configurado.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 