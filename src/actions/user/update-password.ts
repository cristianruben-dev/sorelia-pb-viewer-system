'use server'

import { hashPassword, verifyPassword } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

export async function updateUserPasswordAction(
	currentPassword?: string,
	newPassword?: string,
) {
	try {
		const user = await getCurrentUser()

		if (!user) {
			return { error: 'No autenticado' }
		}

		if (!currentPassword || !newPassword) {
			return { error: 'Todos los campos son requeridos' }
		}

		if (newPassword.length < 8) {
			return { error: 'La nueva contraseña debe tener al menos 8 caracteres' }
		}

		const userWithPassword = await prisma.user.findUnique({
			where: { id: user.id },
			select: { id: true, password: true },
		})

		if (!userWithPassword) {
			return { error: 'Usuario no encontrado' }
		}

		const isValid = await verifyPassword(
			currentPassword,
			userWithPassword.password,
		)

		if (!isValid) {
			return { error: 'La contraseña actual es incorrecta' }
		}

		const hashedPassword = await hashPassword(newPassword)

		await prisma.user.update({
			where: { id: user.id },
			data: { password: hashedPassword },
		})

		return { success: true }
	} catch (error) {
		console.error('Error updating password:', error)
		return { error: 'Error interno del servidor' }
	}
}
