import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const assignUsersSchema = z.object({
	userIds: z.array(z.string()),
})

interface RouteParams {
	params: Promise<{ id: string }>
}

// GET: Obtener usuarios con acceso al reporte
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await getCurrentUser()
		const { id: reportId } = await params

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
		}

		// Verificar que el reporte existe
		const report = await prisma.powerBIContent.findUniqueOrThrow({
			where: { id: reportId },
			include: {
				userAccess: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								role: true,
							},
						},
					},
				},
			},
		})

		return NextResponse.json(report.userAccess.map((access) => access.user))
	} catch (error) {
		console.error('Error fetching report users:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		)
	}
}

// PUT: Asignar usuarios al reporte (reemplaza los existentes)
