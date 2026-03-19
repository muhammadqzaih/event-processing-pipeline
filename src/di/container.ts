import { PrismaClient } from "@prisma/client";
import { container } from 'tsyringe';
import { TOKENS } from "../domain/tokens";
import { getPrismaClient } from "../infrastructure/database/prisma-client";
import { PrismaPipelineRepository } from "../infrastructure/repositories/PrismaPipelineRepository";
import { PrismaActionRepository } from "../infrastructure/repositories/PrismaActionRepository";
import { PipelineService } from "../application/services";
import { ActionService } from "../application/services";
import { SubscriberService } from "../application/services";
import { PrismaSubscriberRepository } from "../infrastructure/repositories/PrismaSubscriberRepository";
import { PrismaJobRepository } from "../infrastructure/repositories/PrismaJobRepository";

import { WebhookService } from "../application/services";
import { BullMQQueueService } from "../infrastructure/services/BullMQQueueService";
import { JobService } from "../application/services";

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

  container.register(TOKENS.JobRepository,
    { useClass: PrismaJobRepository })

  // Application Services
  container.register(TOKENS.SubscriberService,
    { useClass: SubscriberService })

  container.register(TOKENS.PipelineService,
    { useClass: PipelineService })

  container.register(TOKENS.ActionService,
    { useClass: ActionService })

  container.register(TOKENS.WebhookService,
    { useClass: WebhookService })

  container.register(TOKENS.JobService,
    { useClass: JobService })  
    
  // Infrastructure Services
  container.registerSingleton(TOKENS.QueueService, BullMQQueueService)

}


export {container};