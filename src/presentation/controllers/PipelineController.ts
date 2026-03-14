import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IPipelineService } from '../../application/interfaces/IPipelineService';
import { TOKENS } from '../../domain/tokens';
import { sendCreated } from '../../shared/http/response';


@injectable()
export class PipelineController {
  constructor(
    @inject(TOKENS.PipelineService)
    private readonly pipelineService: IPipelineService,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const result = await this.pipelineService.create(req.body)
    sendCreated(res, result, "Pipeline created")
  }
  
}
