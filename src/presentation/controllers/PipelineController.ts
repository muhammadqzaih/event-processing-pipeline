import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../domain/tokens';
import { IMediator } from '../../application/contracts';
import { PipelineMapper } from '../../application/Mappers/barrel';
import { sendCreated, sendNoContent, sendOk } from '../common/http/response';
import { ParamsHandler, TypedHandler } from '../types/http';

import { CreatePipelineCommand } from '../../application/Features/pipeline/commands/create-pipeline/Command';
import { GetPipelinesQuery } from '../../application/Features/pipeline/queries/get-pipelines/Query';
import { GetPipelineByIdQuery } from '../../application/Features/pipeline/queries/get-pipeline-by-id/Query';
import { UpdatePipelineCommand } from '../../application/Features/pipeline/commands/update-pipeline/Command';
import { DeletePipelineCommand } from '../../application/Features/pipeline/commands/delete-pipeline/Command';
import { CreatePipelineRequest } from '../validators/pipelineValidators';
import { Pipeline } from '../../domain/entities';
import { PipelineResponse, UpdatePipelineRequest } from '../../application/DTOs';


@injectable()
export class PipelineController {
  constructor(
    @inject(TOKENS.Mediator)
    private readonly mediator: IMediator,
  ) {}

  create: TypedHandler<CreatePipelineRequest, PipelineResponse> = async (req, res) => {
    const command = new CreatePipelineCommand(req.body, req.userId);
    const result = await this.mediator.send<Pipeline>(command);
    sendCreated(
      res,
      PipelineMapper.toResponse(result),
      "Pipeline created successfully"
    );
  };
  
  findAll: TypedHandler<unknown, PipelineResponse[]> = async (req, res) => {
    const query = new GetPipelinesQuery(req.userId);
    const result = await this.mediator.send<Pipeline[]>(query);
    sendOk(
      res,
      result.map((pipeline) => PipelineMapper.toResponse(pipeline)),
      "Pipelines retrieved successfully"
    );
  }

  findById: ParamsHandler<{ id: string }, PipelineResponse> = async (req, res) => {
    const query = new GetPipelineByIdQuery(req.params.id, req.userId);
    const result = await this.mediator.send<Pipeline>(query);
    sendOk(
      res,
      PipelineMapper.toResponse(result),
      "Pipeline retrieved successfully"
    );
  };

  update: TypedHandler<UpdatePipelineRequest, PipelineResponse, { id: string }> = async (req, res) => {
    const command = new UpdatePipelineCommand(req.params.id, req.body, req.userId);
    const pipeline = await this.mediator.send<Pipeline>(command);
    sendOk(
      res,
       PipelineMapper.toResponse(pipeline),
      "Pipeline updated successfully"
    );
  };

  delete: ParamsHandler<{ id: string }, void> = async (req, res) => {
    const command = new DeletePipelineCommand(req.params.id, req.userId);
    await this.mediator.send(command);
    sendNoContent(
      res
    );
  };
}
