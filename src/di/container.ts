import { PrismaClient } from "@prisma/client";
import { container } from 'tsyringe';
import { TOKENS } from "../domain/tokens";
import { getPrismaClient } from "../infrastructure/database/prisma-client";
import { PrismaPipelineRepository } from "../infrastructure/repositories/PrismaPipelineRepository";
import { PrismaActionRepository } from "../infrastructure/repositories/PrismaActionRepository";
import { PipelineService } from "../application/services/PipelineService";
import { ActionService } from "../application/services/ActionService";

export function registerDependencies(): void {
  // PrismaClient (singleton)
  container.register<PrismaClient>(TOKENS.PrismaClient, {
    useValue:getPrismaClient(),
  });


  // Repositories
  container.register(TOKENS.PipelineRepository,
    { useClass: PrismaPipelineRepository })

  container.register(TOKENS.ActionRepository,
    { useClass: PrismaActionRepository })


  
  // Application Services
  container.register(TOKENS.PipelineService,
    { useClass: PipelineService })

  container.register(TOKENS.ActionService,
    { useClass: ActionService })

  // Infrastructure Services

}


export {container};