import { serverEnv } from "@/config/env/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (serverEnv.APP_ENV !== "production") globalForPrisma.prisma = prisma;
