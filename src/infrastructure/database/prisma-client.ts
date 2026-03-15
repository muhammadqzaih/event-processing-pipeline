import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from '@prisma/adapter-mssql'
import { config } from "../../config";


let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      adapter: new PrismaMssql(config.database.url),
      log:
        config.nodeEnv === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  return prismaInstance;
}

export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}