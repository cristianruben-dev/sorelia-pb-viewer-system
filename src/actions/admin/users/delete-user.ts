'use server'

import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

export async function deleteUserAction(id: string) {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return { error: 'No autorizado' }
		}

		const existingUser = await prisma.user.findUnique({
			where: { id },
		})

		if (!existingUser) {
			return { error: 'Usuario no encontrado' }
		}

		if (id === user.id) {
			return { error: 'No puedes eliminarte a ti mismo' }
		}

		await prisma.user.delete({
			where: { id },
		})

		return { success: true, message: 'Usuario eliminado exitosamente' }
	} catch (error) {
		console.error('Error deleting user:', error)
		return { error: 'Error interno del servidor' }
	}
}
