import { PrismaClient } from "@prisma/client";
import { container } from 'tsyringe';
import { TOKENS } from "../domain/tokens";
import { getPrismaClient } from "../infrastructure/database/prisma-client";
import { PrismaPipelineRepository } from "../infrastructure/repositories/PrismaPipelineRepository";
import { PipelineService } from "../application/services/PipelineService";

export function registerDependencies(): void {
  // PrismaClient (singleton)
  container.register<PrismaClient>(TOKENS.PrismaClient, {
    useValue:getPrismaClient(),
  });


  // Repositories
  container.register(TOKENS.PipelineRepository,
    { useClass: PrismaPipelineRepository })


  
  // Application Services
  container.register(TOKENS.PipelineService,
    { useClass: PipelineService })

  // Infrastructure Services

}


export {container};