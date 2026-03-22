export const TOKENS = {

  //Repositories
  UserRepository: Symbol.for('IUserRepository'),
  PipelineRepository: Symbol.for('IPipelineRepository'),
  ActionRepository: Symbol.for('IActionRepository'),
  SubscriberRepository: Symbol.for("ISubscriberRepository"),
  JobRepository: Symbol.for("IJobRepository"),
  JobDeliveryRepository: Symbol.for("IJobDeliveryRepository"),

  // Application
  WorkerService: Symbol.for("IWorkerService"),
  ActionExecutor: Symbol.for("IActionExecutor"),

  // Infrastructure
  PrismaClient: Symbol.for('PrismaClient'),
  QueueService: Symbol.for("IQueueService"),
  HttpClient: Symbol.for("IHttpClient"),
  HashService: Symbol.for("IHashService"),
  TokenService: Symbol.for("ITokenService"),
  Mediator: Symbol.for("IMediator"),

} as const;