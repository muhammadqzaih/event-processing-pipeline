import { PrismaClient } from "@prisma/client";
import { container } from 'tsyringe';
import { TOKENS } from "../domain/tokens";
import { getPrismaClient } from "../infrastructure/database/prisma-client";
import { PrismaPipelineRepository } from "../infrastructure/repositories/PrismaPipelineRepository";
import { PrismaActionRepository } from "../infrastructure/repositories/PrismaActionRepository";
import { PipelineService } from "../application/services/PipelineService";
import { ActionService } from "../application/services/ActionService";
import { SubscriberService } from "../application/services/SubscriberService";
import { PrismaSubscriberRepository } from "../infrastructure/repositories/PrismaSubscriberRepository";

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
    
  container.register(TOKENS.SubscriberRepository,
    { useClass: PrismaSubscriberRepository })

  
  // Application Services
  container.register(TOKENS.SubscriberService,
    { useClass: SubscriberService })

  container.register(TOKENS.PipelineService,
    { useClass: PipelineService })

  container.register(TOKENS.ActionService,
    { useClass: ActionService })

  // Infrastructure Services

}


export {container};