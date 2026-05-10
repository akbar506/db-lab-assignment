import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

// Initialize the Prisma Client with the MariaDB adapter before exporting it. This ensures that the client is properly configured to connect to the MariaDB database using the environment variables defined in the .env file. The connection limit is set to 5 to manage database connections efficiently.
const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient }; // This extends the global object to include a prisma property

// Check if Prisma client is already connected to db or not. If not then create a new connection. Otherwise use the existing ones.
export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;