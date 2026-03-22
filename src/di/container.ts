import { PrismaClient } from "@prisma/client";
import { container, DependencyContainer, InjectionToken } from 'tsyringe';
import { TOKENS } from "../domain/tokens";
import { getPrismaClient } from "../infrastructure/database/prisma-client";
import { PrismaPipelineRepository } from "../infrastructure/repositories/PrismaPipelineRepository";
import { PrismaActionRepository } from "../infrastructure/repositories/PrismaActionRepository";
import { PrismaSubscriberRepository } from "../infrastructure/repositories/PrismaSubscriberRepository";
import { PrismaJobRepository } from "../infrastructure/repositories/PrismaJobRepository";
import { PrismaJobDeliveryRepository } from "../infrastructure/repositories/PrismaJobDeliveryRepository";
import { BullMQQueueService } from "../infrastructure/services/BullMQQueueService";
import { WorkerService } from "../application/Features/worker/WorkerService";
import { TransformExecutor } from "../application/Features/worker/executors/TransformExecutor";
import { FilterExecutor } from "../application/Features/worker/executors/FilterExecutor";
import { EnrichExecutor } from "../application/Features/worker/executors/EnrichExecutor";
import { FetchHttpClient } from "../infrastructure/services/FetchHttpClient"; 
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { BcryptHashService } from "../infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../infrastructure/services/JwtTokenService";
import { IMediator } from "../application/contracts";
import { Mediator } from "../application/mediator/Mediator";
import { CreatePipelineCommand } from "../application/Features/pipeline/commands/create-pipeline/Command";
import { CreatePipelineHandler } from "../application/Features/pipeline/commands/create-pipeline/Handler";
import { UpdatePipelineCommand } from "../application/Features/pipeline/commands/update-pipeline/Command";
import { UpdatePipelineHandler } from "../application/Features/pipeline/commands/update-pipeline/Handler";
import { DeletePipelineCommand } from "../application/Features/pipeline/commands/delete-pipeline/Command";
import { DeletePipelineHandler } from "../application/Features/pipeline/commands/delete-pipeline/Handler";
import { GetPipelinesQuery } from "../application/Features/pipeline/queries/get-pipelines/Query";
import { GetPipelinesHandler } from "../application/Features/pipeline/queries/get-pipelines/Handler";
import { GetPipelineByIdQuery } from "../application/Features/pipeline/queries/get-pipeline-by-id/Query";
import { GetPipelineByIdHandler } from "../application/Features/pipeline/queries/get-pipeline-by-id/Handler";
import { RegisterUserCommand } from "../application/Features/auth/commands/register-user/Command";
import { RegisterUserHandler } from "../application/Features/auth/commands/register-user/Handler";
import { LoginUserCommand } from "../application/Features/auth/commands/login-user/Command";
import { LoginUserHandler } from "../application/Features/auth/commands/login-user/Handler";
import { CreateActionCommand } from "../application/Features/action/commands/create-action/Command";
import { CreateActionHandler } from "../application/Features/action/commands/create-action/Handler";
import { UpdateActionCommand } from "../application/Features/action/commands/update-action/Command";
import { UpdateActionHandler } from "../application/Features/action/commands/update-action/Handler";
import { DeleteActionCommand } from "../application/Features/action/commands/delete-action/Command";
import { DeleteActionHandler } from "../application/Features/action/commands/delete-action/Handler";
import { GetActionsByPipelineIdQuery } from "../application/Features/action/queries/get-actions-by-pipeline-id/Query";
import { GetActionsByPipelineIdHandler } from "../application/Features/action/queries/get-actions-by-pipeline-id/Handler";
import { CreateSubscriberCommand } from "../application/Features/subscriber/commands/create-subscriber/Command";
import { CreateSubscriberHandler } from "../application/Features/subscriber/commands/create-subscriber/Handler";
import { UpdateSubscriberCommand } from "../application/Features/subscriber/commands/update-subscriber/Command";
import { UpdateSubscriberHandler } from "../application/Features/subscriber/commands/update-subscriber/Handler";
import { DeleteSubscriberCommand } from "../application/Features/subscriber/commands/delete-subscriber/Command";
import { DeleteSubscriberHandler } from "../application/Features/subscriber/commands/delete-subscriber/Handler";
import { GetSubscribersByPipelineIdQuery } from "../application/Features/subscriber/queries/get-subscribers-by-pipeline-id/Query";
import { GetSubscribersByPipelineIdHandler } from "../application/Features/subscriber/queries/get-subscribers-by-pipeline-id/Handler";
import { IngestWebhookCommand } from "../application/Features/webhook/commands/ingest-webhook/Command";
import { IngestWebhookHandler } from "../application/Features/webhook/commands/ingest-webhook/Handler";
import { GetJobByIdQuery } from "../application/Features/job/queries/get-job-by-id/Query";
import { GetJobByIdHandler } from "../application/Features/job/queries/get-job-by-id/Handler";
import { GetJobsByPipelineIdQuery } from "../application/Features/job/queries/get-jobs-by-pipeline-id/Query";
import { GetJobsByPipelineIdHandler } from "../application/Features/job/queries/get-jobs-by-pipeline-id/Handler";
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

  const requestHandlers = new Map<new (...args: any[]) => object, InjectionToken<unknown>>([
    [CreatePipelineCommand, CreatePipelineHandler],
    [UpdatePipelineCommand, UpdatePipelineHandler],
    [DeletePipelineCommand, DeletePipelineHandler],
    [GetPipelinesQuery, GetPipelinesHandler],
    [GetPipelineByIdQuery, GetPipelineByIdHandler],
    [RegisterUserCommand, RegisterUserHandler],
    [LoginUserCommand, LoginUserHandler],
    [CreateActionCommand, CreateActionHandler],
    [UpdateActionCommand, UpdateActionHandler],
    [DeleteActionCommand, DeleteActionHandler],
    [GetActionsByPipelineIdQuery, GetActionsByPipelineIdHandler],
    [CreateSubscriberCommand, CreateSubscriberHandler],
    [UpdateSubscriberCommand, UpdateSubscriberHandler],
    [DeleteSubscriberCommand, DeleteSubscriberHandler],
    [GetSubscribersByPipelineIdQuery, GetSubscribersByPipelineIdHandler],
    [IngestWebhookCommand, IngestWebhookHandler],
    [GetJobByIdQuery, GetJobByIdHandler],
    [GetJobsByPipelineIdQuery, GetJobsByPipelineIdHandler],
  ]);

  container.register<IMediator>(TOKENS.Mediator, {
    useFactory: (dependencyContainer: DependencyContainer) =>
      new Mediator(dependencyContainer, requestHandlers),
  });

}


export {container};