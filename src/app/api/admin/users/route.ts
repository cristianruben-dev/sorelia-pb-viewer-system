import { isUserAdmin } from '@/lib/access-control'
import { hashPassword } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createUserSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	email: z.string().email('Email inválido'),
	password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
	role: z.string().default('user'),
})

export async function GET() {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				active: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						sessions: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		})

		return NextResponse.json(users)
	} catch (error) {
		console.error('Error fetching users:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		)
	}
}

