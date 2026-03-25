'use server'

import {
	createSession,
	logLoginAttempt,
	setSessionCookie,
	verifyPassword,
} from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function loginAction(email?: string, password?: string) {
	try {
		if (!email || !password) {
			return { error: 'Email y contraseña son requeridos' }
		}

		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		})

		if (!user) {
			return { error: 'Credenciales inválidas' }
		}

		const isValidPassword = await verifyPassword(password, user.password)

		const headersList = await headers()

		// We shouldn't rely heavily on exact client IPs natively without external context in Server Actions,
		// but we extract available headers exactly like the original route.
		const ipAddress = headersList.get('x-forwarded-for') ?? undefined
		const userAgent = headersList.get('user-agent') ?? undefined

		if (!isValidPassword) {
			await logLoginAttempt(user.id, false, ipAddress, userAgent)
			return { error: 'Credenciales inválidas' }
		}

		if (!user.active) {
			return { error: 'Usuario desactivado' }
		}

		const session = await createSession(user.id, ipAddress, userAgent)

		await logLoginAttempt(user.id, true, ipAddress, userAgent)

		await setSessionCookie(session.token)

		return {
			success: true,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		}
	} catch (error) {
		console.error('Error en loginAction:', error)
		return { error: 'Error al iniciar sesión' }
	}
}
