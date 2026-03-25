'use server'

import { isUserAdmin } from '@/lib/access-control'
import { hashPassword } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createUserSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	email: z.string().email('Email inválido'),
	password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
	role: z.string().default('user'),
})

export async function createUserAction(data: {
	name: string
	email: string
	password: string
	role?: string
}) {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return { error: 'No autorizado' }
		}

		const validatedData = createUserSchema.parse(data)

		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email.toLowerCase() },
		})

		if (existingUser) {
			return { error: 'Ya existe un usuario con ese email' }
		}

		const hashedPassword = await hashPassword(validatedData.password)

		const newUser = await prisma.user.create({
			data: {
				name: validatedData.name,
				email: validatedData.email.toLowerCase(),
				password: hashedPassword,
				role: validatedData.role,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				active: true,
				createdAt: true,
				updatedAt: true,
				_count: { select: { sessions: true } },
			},
		})

		return { success: true, data: newUser }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { error: 'Datos inválidos' }
		}

		console.error('Error creating user:', error)
		return { error: 'Error interno del servidor' }
	}
}
