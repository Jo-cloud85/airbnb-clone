import { PrismaClient } from "@prisma/client/extension";

// change the filename from prismadb.ts to prismadb.d.ts
/**
 * If you want to add prisma to the global scope properly, you should define it in a .d.ts file to make 
 * TypeScript aware of it. This helps TypeScript understand that prisma is globally accessible.
 */

declare global {
    const prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV != 'production') globalThis.prisma = client;

export default client;