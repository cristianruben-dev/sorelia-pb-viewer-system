'use server'

import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createDashboardSchema = z.object({
	title: z.string().min(1, 'El título es requerido'),
	iframeHtml: z.string().optional(),
})

export async function createDashboardAction(data: {
	title: string
	iframeHtml?: string
}) {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return { error: 'No autorizado' }
		}

		const validatedData = createDashboardSchema.parse(data)

		const dashboard = await prisma.powerBIContent.create({
			data: {
				title: validatedData.title,
				iframeHtml: validatedData.iframeHtml || '',
			},
			include: {
				_count: {
					select: { userAccess: true },
				},
			},
		})

		return { success: true, data: dashboard }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: 'Datos inválidos' }
		}

		console.error('Error creating dashboard:', error)
		return { error: 'Error interno del servidor' }
	}
}
