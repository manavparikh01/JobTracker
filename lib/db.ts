import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 connects through a driver adapter. We use node-postgres against
// Supabase. At runtime the app uses the pooled connection (DATABASE_URL);
// migrations use the direct connection (DIRECT_URL) via prisma.config.ts.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Reuse one client across hot reloads in dev to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
