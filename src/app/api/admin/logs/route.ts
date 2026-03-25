import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
		}

		// Obtener todos los logs unificados
		const logs = await prisma.activityLog.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				report: {
					select: {
						id: true,
						title: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			take: 200, // Últimos 200 logs
		})

		return NextResponse.json({ logs })
	} catch (error) {
		console.error('Error fetching logs:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		)
	}
}
