export const TOKENS = {

  //Repositories
  PipelineRepository: Symbol.for('IPipelineRepository'),
  ActionRepository: Symbol.for('IActionRepository'),
  SubscriberRepository: Symbol.for("ISubscriberRepository"),
  //Services

  //Application Services
  PipelineService: Symbol.for('IPipelineService'),
  ActionService: Symbol.for('IActionService'),
  SubscriberService: Symbol.for("ISubscriberService"),

  // Infrastructure
  PrismaClient: Symbol.for('PrismaClient'),
} as const;