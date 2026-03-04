import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		SMTP_SERVER: z.string(),
		SMTP_PORT: z.string(),
		SMTP_USER: z.string(),
		SMTP_PASSWORD: z.string(),
		SMTP_FROM_ADDRESS: z.string().email(),
	},
	client: {},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		SMTP_SERVER: process.env.SMTP_SERVER,
		SMTP_PORT: process.env.SMTP_PORT,
		SMTP_USER: process.env.SMTP_USER,
		SMTP_PASSWORD: process.env.SMTP_PASSWORD,
		SMTP_FROM_ADDRESS: process.env.SMTP_FROM_ADDRESS,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
})
