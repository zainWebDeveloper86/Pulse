import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// reuse connection from global storage box in browser
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// make adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// build connection with postgresql database
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, 
    log:
      process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

// if not in production, set connection in global storage box in browser
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;