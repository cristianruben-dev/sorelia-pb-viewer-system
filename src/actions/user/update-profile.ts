'use server'

import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

export async function updateUserProfileAction(name: string) {
	try {
		const user = await getCurrentUser()

		if (!user) {
			return { error: 'No autenticado' }
		}

		if (!name || name.trim().length === 0) {
			return { error: 'El nombre es requerido' }
		}

		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: { name: name.trim() },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				active: true,
			},
		})

		return { success: true, data: updatedUser }
	} catch (error) {
		console.error('Error updating profile:', error)
		return { error: 'Error interno del servidor' }
	}
}
