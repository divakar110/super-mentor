
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

const prismaClientSingleton = () => {
    // If we are strictly in a build phase where DB isn't needed (e.g. client side only pages),
    // we might want to skip this, but API routes need it.
    // Ensure we have a connection string, otherwise the Pool crashes or Adapter fails.
    if (!connectionString) {
        if (process.env.NODE_ENV === 'production') {
            // In production build for static export, this might be hit if we don't have DB url.
            // But API routes shouldn't be built for static export.
            console.warn("DATABASE_URL is missing. Prisma Client will fail to initialize if used.");
        }
        // Fallback for types satisfaction, though runtime will fail if used
        return new PrismaClient();
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
