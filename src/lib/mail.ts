import { env } from '@/env'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
	host: env.SMTP_SERVER,
	port: Number(env.SMTP_PORT),
	secure: env.SMTP_PORT === '465', // true for 465, false for other ports
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASSWORD,
	},
})

export const FROM_EMAIL = env.SMTP_FROM_ADDRESS
