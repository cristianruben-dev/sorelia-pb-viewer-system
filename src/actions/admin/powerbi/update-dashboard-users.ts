'use server'

import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const assignUsersSchema = z.object({
	userIds: z.array(z.string()),
})

export async function updateDashboardUsersAction(
	reportId: string,
	userIds: string[],
) {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return { error: 'No autorizado' }
		}

		const validatedData = assignUsersSchema.parse({ userIds })

		const report = await prisma.powerBIContent.findUnique({
			where: { id: reportId },
		})

		if (!report) {
			return { error: 'Reporte no encontrado' }
		}

		await prisma.userReportAccess.deleteMany({
			where: { reportId },
		})

		if (validatedData.userIds.length > 0) {
			await prisma.userReportAccess.createMany({
				data: validatedData.userIds.map((uid) => ({
					userId: uid,
					reportId,
				})),
				skipDuplicates: true,
			})
		}

		const updatedReport = await prisma.powerBIContent.findUnique({
			where: { id: reportId },
			include: {
				userAccess: {
					include: {
						user: {
							select: { id: true, name: true, email: true, role: true },
						},
					},
				},
			},
		})

		return { success: true, data: updatedReport }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: 'Datos inválidos' }
		}

		console.error('Error assigning users:', error)
		return { error: 'Error interno del servidor' }
	}
}
