'use server'

import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

export async function deleteDashboardAction(id: string) {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return { error: 'No autorizado' }
		}

		const existingDashboard = await prisma.powerBIContent.findUnique({
			where: { id },
		})

		if (!existingDashboard) {
			return { error: 'Dashboard no encontrado' }
		}

		await prisma.powerBIContent.delete({
			where: { id },
		})

		return { success: true, message: 'Dashboard eliminado exitosamente' }
	} catch (error) {
		console.error('Error deleting dashboard:', error)
		return { error: 'Error interno del servidor' }
	}
}
