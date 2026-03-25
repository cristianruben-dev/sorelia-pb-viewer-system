'use server'

import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateDashboardSchema = z.object({
	title: z.string().min(1, 'El título es requerido').optional(),
	iframeHtml: z.string().optional(),
})

export async function updateDashboardAction(
	id: string,
	data: { title?: string; iframeHtml?: string },
) {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return { error: 'No autorizado' }
		}

		const validatedData = updateDashboardSchema.parse(data)

		const existingDashboard = await prisma.powerBIContent.findUnique({
			where: { id },
		})

		if (!existingDashboard) {
			return { error: 'Dashboard no encontrado' }
		}

		const updateData: Partial<{ title: string; iframeHtml: string }> = {}
		if (validatedData.title !== undefined)
			updateData.title = validatedData.title
		if (validatedData.iframeHtml !== undefined)
			updateData.iframeHtml = validatedData.iframeHtml

		const updatedDashboard = await prisma.powerBIContent.update({
			where: { id },
			data: updateData,
			include: {
				_count: {
					select: { userAccess: true },
				},
			},
		})

		return { success: true, data: updatedDashboard }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: 'Datos inválidos' }
		}

		console.error('Error updating dashboard:', error)
		return { error: 'Error interno del servidor' }
	}
}
