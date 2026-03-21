import { PrismaClient } from "@prisma/client";
import { container } from 'tsyringe';
import { TOKENS } from "../domain/tokens";
import { getPrismaClient } from "../infrastructure/database/prisma-client";
import { PrismaPipelineRepository } from "../infrastructure/repositories/PrismaPipelineRepository";
import { PrismaActionRepository } from "../infrastructure/repositories/PrismaActionRepository";
import { ActionService, AuthService, JobService, PipelineService, SubscriberService, WebhookService } from "../application/services";
import { PrismaSubscriberRepository } from "../infrastructure/repositories/PrismaSubscriberRepository";
import { PrismaJobRepository } from "../infrastructure/repositories/PrismaJobRepository";
import { PrismaJobDeliveryRepository } from "../infrastructure/repositories/PrismaJobDeliveryRepository";
import { BullMQQueueService } from "../infrastructure/services/BullMQQueueService";
import { WorkerService } from "../application/services/worker/WorkerService";
import { TransformExecutor } from "../application/services/worker/executors/TransformExecutor";
import { FilterExecutor } from "../application/services/worker/executors/FilterExecutor";
import { EnrichExecutor } from "../application/services/worker/executors/EnrichExecutor";
import { FetchHttpClient } from "../infrastructure/services/FetchHttpClient"; 
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { BcryptHashService } from "../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService";
export function registerDependencies(): void {
  // PrismaClient (singleton)
  container.register<PrismaClient>(TOKENS.PrismaClient, {
    useValue:getPrismaClient(),
  });

  // Repositories
  container.register(TOKENS.UserRepository,
    { useClass: PrismaUserRepository })

  container.register(TOKENS.PipelineRepository,
    { useClass: PrismaPipelineRepository })

  container.register(TOKENS.ActionRepository,
    { useClass: PrismaActionRepository })
    
  container.register(TOKENS.SubscriberRepository,
    { useClass: PrismaSubscriberRepository })

  container.register(TOKENS.JobRepository,
    { useClass: PrismaJobRepository })

  container.register(TOKENS.JobDeliveryRepository,
    { useClass: PrismaJobDeliveryRepository })

  // Application Services
  container.register(TOKENS.SubscriberService,
    { useClass: SubscriberService })

  container.register(TOKENS.PipelineService,
    { useClass: PipelineService })

  container.register(TOKENS.ActionService,
    { useClass: ActionService })

  container.register(TOKENS.WebhookService,
    { useClass: WebhookService })

  container.register(TOKENS.AuthService,
    { useClass: AuthService })

  container.register(TOKENS.JobService,
    { useClass: JobService })

  container.register(TOKENS.WorkerService,
    { useClass: WorkerService })

  container.register(TOKENS.HttpClient,
    { useClass: FetchHttpClient })

  container.register(TOKENS.HashService,
    { useClass: BcryptHashService })

  container.register(TOKENS.TokenService,
    { useClass: JwtTokenService })

  container.register(TOKENS.ActionExecutor,
    { useClass: TransformExecutor })

  container.register(TOKENS.ActionExecutor,
    { useClass: FilterExecutor })

  container.register(TOKENS.ActionExecutor,
    { useClass: EnrichExecutor })
    
  // Infrastructure Services
  container.registerSingleton(TOKENS.QueueService, BullMQQueueService)

}


export {container};