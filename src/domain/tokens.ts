export const TOKENS = {

  //Repositories
  PipelineRepository: Symbol.for('IPipelineRepository'),

  //Services

  //Application Services
  PipelineService: Symbol.for('IPipelineService'),

  // Infrastructure
  PrismaClient: Symbol.for('PrismaClient'),
} as const;