'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function resetPasswordAction(token: string, password: string) {
	try {
		if (!token || !password) {
			return { error: 'Token and password are required' }
		}

		if (password.length < 8) {
			return { error: 'Password must be at least 8 characters long' }
		}

		const resetToken = await prisma.passwordResetToken.findUnique({
			where: { token },
		})

		if (!resetToken) {
			return { error: 'Invalid token' }
		}

		if (resetToken.used) {
			return { error: 'This token has already been used' }
		}

		if (!resetToken.verified) {
			return { error: 'Token not verified. Please verify the OTP code first.' }
		}

		if (new Date() > resetToken.expiresAt) {
			return { error: 'This token has expired' }
		}

		const user = await prisma.user.findUnique({
			where: { email: resetToken.email },
		})

		if (!user) {
			return { error: 'User not found' }
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		await prisma.$transaction([
			prisma.user.update({
				where: { id: user.id },
				data: { password: hashedPassword },
			}),
			prisma.passwordResetToken.update({
				where: { id: resetToken.id },
				data: { used: true },
			}),
			prisma.session.deleteMany({
				where: { userId: user.id },
			}),
		])

		return { success: true, message: 'Password reset successfully' }
	} catch (error) {
		console.error('Error in resetPasswordAction:', error)
		return { error: 'Internal server error' }
	}
}
