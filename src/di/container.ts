import { PrismaClient } from "@prisma/client";
import { container, DependencyContainer, InjectionToken } from 'tsyringe';
import { TOKENS } from "../Domain/tokens";
import { getPrismaClient } from "../Infrastructure/database/prisma-client";
import { PrismaPipelineRepository } from "../Infrastructure/repositories/PrismaPipelineRepository";
import { PrismaActionRepository } from "../Infrastructure/repositories/PrismaActionRepository";
import { PrismaSubscriberRepository } from "../Infrastructure/repositories/PrismaSubscriberRepository";
import { PrismaJobRepository } from "../Infrastructure/repositories/PrismaJobRepository";
import { PrismaJobDeliveryRepository } from "../Infrastructure/repositories/PrismaJobDeliveryRepository";
import { BullMQQueueService } from "../Infrastructure/services/BullMQQueueService";
import { WorkerService } from "../Application/Features/worker/WorkerService";
import { TransformExecutor } from "../Application/Features/worker/executors/TransformExecutor";
import { FilterExecutor } from "../Application/Features/worker/executors/FilterExecutor";
import { EnrichExecutor } from "../Application/Features/worker/executors/EnrichExecutor";
import { FetchHttpClient } from "../Infrastructure/services/FetchHttpClient"; 
import { PrismaUserRepository } from "../Infrastructure/repositories/PrismaUserRepository";
import { BcryptHashService } from "../Infrastructure/services/BcryptHashService";
import { JwtTokenService } from "../Infrastructure/services/JwtTokenService";
import { IMediator } from "../Application/Contracts";
import { Mediator } from "../Application/Mediator/Mediator";
import { CreatePipelineCommand } from "../Application/Features/pipeline/commands/CreatePipeline/Command";
import { CreatePipelineHandler } from "../Application/Features/pipeline/commands/CreatePipeline/Handler";
import { UpdatePipelineCommand } from "../Application/Features/pipeline/commands/UpdatePipeline/Command";
import { UpdatePipelineHandler } from "../Application/Features/pipeline/commands/UpdatePipeline/Handler";
import { DeletePipelineCommand } from "../Application/Features/pipeline/commands/DeletePipeline/Command";
import { DeletePipelineHandler } from "../Application/Features/pipeline/commands/DeletePipeline/Handler";
import { GetPipelinesQuery } from "../Application/Features/pipeline/queries/GetPipelines/Query";
import { GetPipelinesHandler } from "../Application/Features/pipeline/queries/GetPipelines/Handler";
import { GetPipelineByIdQuery } from "../Application/Features/pipeline/queries/GetPipelineById/Query";
import { GetPipelineByIdHandler } from "../Application/Features/pipeline/queries/GetPipelineById/Handler";
import { RegisterUserCommand } from "../Application/Features/auth/commands/RegisterUser/Command";
import { RegisterUserHandler } from "../Application/Features/auth/commands/RegisterUser/Handler";
import { LoginUserCommand } from "../Application/Features/auth/commands/LoginUser/Command";
import { LoginUserHandler } from "../Application/Features/auth/commands/LoginUser/Handler";
import { CreateActionCommand } from "../Application/Features/action/commands/CreateAction/Command";
import { CreateActionHandler } from "../Application/Features/action/commands/CreateAction/Handler";
import { UpdateActionCommand } from "../Application/Features/action/commands/UpdateAction/Command";
import { UpdateActionHandler } from "../Application/Features/action/commands/UpdateAction/Handler";
import { DeleteActionCommand } from "../Application/Features/action/commands/DeleteAction/Command";
import { DeleteActionHandler } from "../Application/Features/action/commands/DeleteAction/Handler";
import { GetActionsByPipelineIdQuery } from "../Application/Features/action/queries/GetActionsByPipelineId/Query";
import { GetActionsByPipelineIdHandler } from "../Application/Features/action/queries/GetActionsByPipelineId/Handler";
import { CreateSubscriberCommand } from "../Application/Features/subscriber/commands/CreateSubscriber/Command";
import { CreateSubscriberHandler } from "../Application/Features/subscriber/commands/CreateSubscriber/Handler";
import { UpdateSubscriberCommand } from "../Application/Features/subscriber/commands/UpdateSubscriber/Command";
import { UpdateSubscriberHandler } from "../Application/Features/subscriber/commands/UpdateSubscriber/Handler";
import { DeleteSubscriberCommand } from "../Application/Features/subscriber/commands/DeleteSubscriber/Command";
import { DeleteSubscriberHandler } from "../Application/Features/subscriber/commands/DeleteSubscriber/Handler";
import { GetSubscribersByPipelineIdQuery } from "../Application/Features/subscriber/queries/GetSubscribersByPipelineId/Query";
import { GetSubscribersByPipelineIdHandler } from "../Application/Features/subscriber/queries/GetSubscribersByPipelineId/Handler";
import { IngestWebhookCommand } from "../Application/Features/webhook/commands/IngestWebhook/Command";
import { IngestWebhookHandler } from "../Application/Features/webhook/commands/IngestWebhook/Handler";
import { GetJobByIdQuery } from "../Application/Features/job/queries/GetJobById/Query";
import { GetJobByIdHandler } from "../Application/Features/job/queries/GetJobById/Handler";
import { GetJobsByPipelineIdQuery } from "../Application/Features/job/queries/GetJobsByPipelineId/Query";
import { GetJobsByPipelineIdHandler } from "../Application/Features/job/queries/GetJobsByPipelineId/Handler";
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