import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Establish a shared global type interface to manage Next.js hot-reloads safely
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: pg.Pool };

// 1. Create or reference a reusable connection pool
const pool = globalForPrisma.pool || new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap that pool instance inside the Prisma Pg Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the active adapter definition into the client instance constructor
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// Save instances globally in development to prevent hitting PostgreSQL connection limits during hot-reloads
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
