export const TOKENS = {

  //Repositories
  UserRepository: Symbol.for('IUserRepository'),
  PipelineRepository: Symbol.for('IPipelineRepository'),
  ActionRepository: Symbol.for('IActionRepository'),
  SubscriberRepository: Symbol.for("ISubscriberRepository"),
  JobRepository: Symbol.for("IJobRepository"),
  JobDeliveryRepository: Symbol.for("IJobDeliveryRepository"),
  //Services

  //Application Services
  PipelineService: Symbol.for('IPipelineService'),
  ActionService: Symbol.for('IActionService'),
  JobService: Symbol.for("IJobService"),
  SubscriberService: Symbol.for("ISubscriberService"),
  WebhookService: Symbol.for("IWebhookService"),
  AuthService: Symbol.for("IAuthService"),
  WorkerService: Symbol.for("IWorkerService"),
  ActionExecutor: Symbol.for("IActionExecutor"),

  // Infrastructure
  PrismaClient: Symbol.for('PrismaClient'),
  QueueService: Symbol.for("IQueueService"),
  HttpClient: Symbol.for("IHttpClient"),
  HashService: Symbol.for("IHashService"),
  TokenService: Symbol.for("ITokenService"),

} as const;