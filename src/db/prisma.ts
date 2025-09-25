import { PrismaClient } from "../app/db/generated/prisma";

// Use global type-safe cache to avoid multiple instances in dev (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // or ["query", "error", "warn"] if you want more logging
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
