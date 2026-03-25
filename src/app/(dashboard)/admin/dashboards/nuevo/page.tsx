import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import { NuevoDashboardClient } from './nuevo-dashboard-client'

export const dynamic = 'force-dynamic'

export default async function NuevoDashboardPage() {
	const user = await getCurrentUser()

	if (!isUserAdmin(user)) {
		redirect('/dashboard')
	}

	return <NuevoDashboardClient />
}
