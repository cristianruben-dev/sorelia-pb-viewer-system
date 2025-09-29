import { prisma } from "./prisma";

// Re-export prisma as db for consistency
export const db = prisma; 