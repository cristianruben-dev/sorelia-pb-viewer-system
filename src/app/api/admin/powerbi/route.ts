import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createDashboardSchema = z.object({
	title: z.string().min(1, 'El título es requerido'),
	iframeHtml: z.string().optional(),
})

export async function GET() {
	try {
		const user = await getCurrentUser()

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
		}

		const dashboards = await prisma.powerBIContent.findMany({
			include: {
				_count: {
					select: {
						userAccess: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		})

		return NextResponse.json(dashboards)
	} catch (error) {
		console.error('Error fetching dashboards:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		)
	}
}

