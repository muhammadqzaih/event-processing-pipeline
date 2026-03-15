export const TOKENS = {

  //Repositories
  PipelineRepository: Symbol.for('IPipelineRepository'),
  ActionRepository: Symbol.for('IActionRepository'),

  //Services

  //Application Services
  PipelineService: Symbol.for('IPipelineService'),
  ActionService: Symbol.for('IActionService'),

  // Infrastructure
  PrismaClient: Symbol.for('PrismaClient'),
} as const;