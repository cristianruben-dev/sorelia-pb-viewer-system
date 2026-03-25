'use server'

import PasswordResetEmail from '@/components/emails/password-reset-email'
import { FROM_EMAIL, transporter } from '@/lib/mail'
import { prisma } from '@/lib/prisma'
import { render } from '@react-email/components'

function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function forgotPasswordAction(email: string) {
	try {
		if (!email) {
			return { error: 'Email is required' }
		}

		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		})

		if (!user) {
			return {
				success: true,
				message: 'If the email exists, a reset code has been sent',
			}
		}

		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
		const recentTokens = await prisma.passwordResetToken.count({
			where: {
				email: email.toLowerCase(),
				createdAt: { gte: oneHourAgo },
			},
		})

		if (recentTokens >= 3) {
			return { error: 'Too many reset requests. Please try again later.' }
		}

		const code = generateOTP()
		const token = crypto.randomUUID()
		const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

		const resetToken = await prisma.passwordResetToken.create({
			data: { email: email.toLowerCase(), token, code, expiresAt },
		})

		try {
			const emailHtml = await render(PasswordResetEmail({ code, email }))
			await transporter.sendMail({
				from: FROM_EMAIL,
				to: email,
				subject: 'Código de Verificación - Restablecer Contraseña',
				html: emailHtml,
			})
		} catch (emailError) {
			console.error('Error sending email:', emailError)
			await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
			return { error: 'Failed to send email. Please try again.' }
		}

		return { success: true, token: resetToken.token }
	} catch (error) {
		console.error('Error in forgotPasswordAction:', error)
		return { error: 'Internal server error' }
	}
}
