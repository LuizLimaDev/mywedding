import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

type PrismaGlobal = typeof globalThis & {
  __prisma?: PrismaClient;
};

const globalForPrisma = globalThis as PrismaGlobal;

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL ??
  "postgresql://localhost:5432/postgres?schema=public";
const adapter = new PrismaPg(connectionString);

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
