'use client'

import { loginAction } from '@/actions/auth/login'
import { logoutAction } from '@/actions/auth/logout'

export async function signIn(email: string, password: string) {
	const result = await loginAction(email, password)

	if (result.error) {
		throw new Error(result.error || 'Error al iniciar sesión')
	}

	return result
}

export async function signOut() {
	await logoutAction()
	window.location.href = '/login'
}
