import { isUserAdmin } from '@/lib/access-control'
import { hashPassword } from '@/lib/auth'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateUserSchema = z.object({
	name: z.string().min(1, 'El nombre es requerido').optional(),
	email: z.string().email('Email inválido').optional(),
	password: z
		.string()
		.min(8, 'La contraseña debe tener al menos 8 caracteres')
		.optional(),
	role: z.string().optional(),
	active: z.boolean().optional(),
})

interface RouteParams {
	params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await getCurrentUser()
		const { id } = await params

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
		}

		const targetUser = await prisma.user.findUnique({
			where: { id },
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
		})

		if (!targetUser) {
			return NextResponse.json(
				{ error: 'Usuario no encontrado' },
				{ status: 404 },
			)
		}

		return NextResponse.json(targetUser)
	} catch (error) {
		console.error('Error fetching user:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		)
	}
}

