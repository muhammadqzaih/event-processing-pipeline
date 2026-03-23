import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../Domain/tokens';
import { IMediator } from '../../Application/Contracts';
import { PipelineMapper } from '../../Application/Mappers/barrel';
import { sendCreated, sendNoContent, sendOk } from '../Common/http/response';
import { ParamsHandler, TypedHandler } from '../Common/http/http';

import { CreatePipelineCommand } from '../../Application/Features/pipeline/commands/CreatePipeline/Command';
import { GetPipelinesQuery } from '../../Application/Features/pipeline/queries/GetPipelines/Query';
import { GetPipelineByIdQuery } from '../../Application/Features/pipeline/queries/GetPipelineById/Query';
import { UpdatePipelineCommand } from '../../Application/Features/pipeline/commands/UpdatePipeline/Command';
import { DeletePipelineCommand } from '../../Application/Features/pipeline/commands/DeletePipeline/Command';
import { CreatePipelineRequest } from '../Validators/pipelineValidators';
import { Pipeline } from '../../Domain/Entities';
import { PipelineResponse, UpdatePipelineRequest } from '../../Application/DTOs';


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
