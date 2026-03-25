import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateDashboardSchema = z.object({
	title: z.string().min(1, 'El título es requerido').optional(),
	iframeHtml: z.string().optional(),
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

		const dashboard = await prisma.powerBIContent.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						userAccess: true,
					},
				},
			},
		})

		if (!dashboard) {
			return NextResponse.json(
				{ error: 'Dashboard no encontrado' },
				{ status: 404 },
			)
		}

		return NextResponse.json(dashboard)
	} catch (error) {
		console.error('Error fetching dashboard:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 },
		)
	}
}

