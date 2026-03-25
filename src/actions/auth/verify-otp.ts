'use server'

import { prisma } from '@/lib/prisma'

export async function verifyOtpAction(token: string, code: string) {
	try {
		if (!token || !code) {
			return { error: 'Token and code are required' }
		}

		const resetToken = await prisma.passwordResetToken.findUnique({
			where: { token },
		})

		if (!resetToken) {
			return { error: 'Invalid or expired token' }
		}

		if (resetToken.used) {
			return { error: 'This code has already been used' }
		}

		if (new Date() > resetToken.expiresAt) {
			return { error: 'This code has expired' }
		}

		if (resetToken.code !== code) {
			return { error: 'Invalid code' }
		}

		await prisma.passwordResetToken.update({
			where: { id: resetToken.id },
			data: { verified: true },
		})

		return { success: true, email: resetToken.email }
	} catch (error) {
		console.error('Error in verifyOtpAction:', error)
		return { error: 'Internal server error' }
	}
}
