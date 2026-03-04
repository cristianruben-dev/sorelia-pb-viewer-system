import type { User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutos

export type AuthUser = User
export type Session = {
	id: string
	userId: string
	token: string
	expiresAt: Date
	user: AuthUser
}

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10)
}

export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash)
}

function generateSessionToken(): string {
	const array = new Uint8Array(32)
	crypto.getRandomValues(array)
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
		'',
	)
}

export async function createSession(
	userId: string,
	ipAddress?: string,
	userAgent?: string,
): Promise<Session> {
	const token = generateSessionToken()
	const expiresAt = new Date(Date.now() + SESSION_DURATION)

	const session = await prisma.session.create({
		data: {
			userId,
			token,
			expiresAt,
			ipAddress,
			userAgent,
		},
		include: {
			user: true,
		},
	})

	return session
}

export async function getSessionByToken(
	token: string,
): Promise<Session | null> {
	const session = await prisma.session.findUnique({
		where: { token },
		include: { user: true },
	})

	if (!session) return null
	if (session.expiresAt < new Date()) {
		await prisma.session.delete({ where: { id: session.id } })
		return null
	}

	return session
}

export async function deleteSession(token: string): Promise<void> {
	await prisma.session.delete({ where: { token } })
}

export async function setSessionCookie(token: string): Promise<void> {
	const cookieStore = await cookies()

	// En producción, por defecto requiere HTTPS (secure: true)
	// Pero permitimos sobreescribirlo con SECURE_COOKIES='false' para pruebas HTTP en servidores
	const isSecure =
		process.env.NODE_ENV === 'production'
			? process.env.SECURE_COOKIES !== 'false'
			: false

	cookieStore.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: isSecure,
		sameSite: 'lax',
		maxAge: SESSION_DURATION / 1000,
		path: '/',
	})
}

export async function deleteSessionCookie(): Promise<void> {
	const cookieStore = await cookies()
	cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSessionToken(): Promise<string | null> {
	const cookieStore = await cookies()
	return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null
}
export async function logLoginAttempt(
	userId: string,
	success: boolean,
	ipAddress?: string,
	userAgent?: string,
): Promise<void> {
	await prisma.activityLog.create({
		data: {
			userId,
			type: 'login',
			action: success
				? 'Inicio de sesión exitoso'
				: 'Intento de inicio de sesión fallido',
			success,
			ipAddress,
			userAgent,
		},
	})
}
