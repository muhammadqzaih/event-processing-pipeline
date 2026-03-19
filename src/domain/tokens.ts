export const TOKENS = {

  //Repositories
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

  // Infrastructure
  PrismaClient: Symbol.for('PrismaClient'),
  QueueService: Symbol.for("IQueueService"),
} as const;