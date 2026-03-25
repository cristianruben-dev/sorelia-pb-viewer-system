import { env } from '@/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)

const getPrisma = () => new PrismaClient({ adapter })

const globalForInternalPrisma = global as unknown as {
  internalPrisma: ReturnType<typeof getPrisma>
}

export const prisma = globalForInternalPrisma.internalPrisma || getPrisma()

if (process.env.NODE_ENV !== 'production') globalForInternalPrisma.internalPrisma = prisma
