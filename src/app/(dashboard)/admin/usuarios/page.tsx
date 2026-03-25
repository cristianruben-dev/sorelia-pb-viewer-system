import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { UsersManagement } from './users-management'

export const dynamic = 'force-dynamic'

export default async function UsuariosPage() {
	const user = await getCurrentUser()

	if (!isUserAdmin(user)) {
		redirect('/dashboard')
	}

	const users = await prisma.user.findMany({
		include: {
			_count: {
				select: {
					sessions: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	})

	return <UsersManagement users={users} />
}
