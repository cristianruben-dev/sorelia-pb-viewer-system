import { prisma } from "./prisma";

/**
 * Registra el acceso de un usuario a un reporte
 */
export async function logReportAccess(
  userId: string,
  reportId: string,
  reportTitle: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        type: "report_access",
        action: `Accedió al reporte: ${reportTitle}`,
        reportId,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // No fallar si el log falla, solo registrar el error
    console.error("Error logging report access:", error);
  }
}

