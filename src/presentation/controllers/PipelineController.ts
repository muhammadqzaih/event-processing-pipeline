import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IPipelineService } from '../../application/interfaces/IPipelineService';
import { TOKENS } from '../../domain/tokens';
import { sendCreated } from '../../shared/http/response';
import { ParamsHandler, TypedHandler } from '../types/http';
import { CreatePipelineRequest, PipelineResponse } from '../../application/dtos/PipelineDTOs';


@injectable()
export class PipelineController {
  constructor(
    @inject(TOKENS.PipelineService)
    private readonly pipelineService: IPipelineService,
  ) {}


  create: TypedHandler<CreatePipelineRequest, PipelineResponse> = async (req, res) => {
    const result = await this.pipelineService.create(req.body);
    sendCreated(res, result, "Pipeline created");
  };
  
  findAll: TypedHandler<unknown, PipelineResponse[]> = async (req, res) => {
    const result = await this.pipelineService.findAll();
    sendCreated(res, result, "Pipelines retrieved successfully");
  }

  findById: ParamsHandler<{ id: string }, PipelineResponse> = async (req, res) => {
    const result = await this.pipelineService.findById(req.params.id);
    sendCreated(res, result, "Pipeline retrieved successfully");
  };
}
