import { CreatePipelineRequest } from "../../../../DTOs";

export class CreatePipelineCommand {
  constructor(
    public readonly data: CreatePipelineRequest,
    public readonly userId: string,
  ) {}
}
