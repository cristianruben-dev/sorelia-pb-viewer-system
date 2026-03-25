'use server'

import { deleteSession, deleteSessionCookie, getSessionToken } from '@/lib/auth'

export async function logoutAction() {
	try {
		const token = await getSessionToken()

		if (token) {
			await deleteSession(token)
		}

		await deleteSessionCookie()

		return { success: true }
	} catch (error) {
		console.error('Error en logoutAction:', error)
		return { error: 'Error al cerrar sesión' }
	}
}
