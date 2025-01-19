import { PrismaClient } from "@prisma/client";

/**
 * I change the code from Antonio's because there were some issues. I found the solution in prisma documentation. 
 * https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
 * When developing a Next.js application, one common issue is accidentally creating multiple instances of the Prisma Client. 
 * This often occurs due to Next.js’s hot-reloading feature in development.
 * Next.js’s hot-reloading feature reloads modules frequently to reflect code changes instantly. 
 * However, this can lead to multiple instances of Prisma Client being created, which consumes resources and might cause unexpected behavior.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;

export default prisma;