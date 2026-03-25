import { isUserAdmin } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
	const user = await getCurrentUser()

	if (!isUserAdmin(user)) {
		redirect('/dashboard')
	}

	redirect('/admin/usuarios')
}
