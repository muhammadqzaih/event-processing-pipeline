import { inject, injectable } from 'tsyringe';
import { IPipelineService } from '../../application/interfaces/IPipelineService';
import { TOKENS } from '../../domain/tokens';
import { PipelineMapper } from '../../application/mappers/barrel';
import { sendCreated, sendOk } from '../../shared/http/response';
import { ParamsHandler, TypedHandler } from '../types/http';
import { CreatePipelineRequest, PipelineResponse, UpdatePipelineRequest } from '../../application/dtos/PipelineDTOs';


@injectable()
export class PipelineController {
  constructor(
    @inject(TOKENS.PipelineService)
    private readonly pipelineService: IPipelineService,
  ) {}

  create: TypedHandler<CreatePipelineRequest, PipelineResponse> = async (req, res) => {
    const result = await this.pipelineService.create(req.body);
    sendCreated(
      res,
      PipelineMapper.toResponse(result),
      "Pipeline created successfully"
    );
  };
  
  findAll: TypedHandler<unknown, PipelineResponse[]> = async (req, res) => {
    const result = await this.pipelineService.findAll();
    sendOk(
      res,
      result.map((pipeline) => PipelineMapper.toResponse(pipeline)),
      "Pipelines retrieved successfully"
    );
  }

  findById: ParamsHandler<{ id: string }, PipelineResponse> = async (req, res) => {
    const result = await this.pipelineService.findById(req.params.id);
    sendOk(
      res,
      PipelineMapper.toResponse(result),
      "Pipeline retrieved successfully"
    );
  };

  update: TypedHandler<UpdatePipelineRequest, PipelineResponse, { id: string }> = async (req, res) => {
    const pipeline = await this.pipelineService.update(req.params.id, req.body);
    sendOk(res, PipelineMapper.toResponse(pipeline), "Pipeline updated successfully");
  };

  delete: ParamsHandler<{ id: string }, void> = async (req, res) => {
    await this.pipelineService.delete(req.params.id);
    sendOk(res, null, "Pipeline deleted successfully");
  };
}
