import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { EditDashboardClient } from './edit-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function EditDashboardPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const resolvedParams = await params
	const user = await getCurrentUser()

	if (!isUserAdmin(user)) {
		redirect('/admin')
	}

	const dashboard = await prisma.powerBIContent.findUnique({
		where: { id: resolvedParams.id },
	})

	if (!dashboard) {
		notFound()
	}

	return (
		<div className="space-y-6">
			<EditDashboardClient dashboard={dashboard} />
		</div>
	)
}
