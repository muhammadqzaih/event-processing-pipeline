import { UpdatePipelineRequest } from "../../../../DTOs";

export class UpdatePipelineCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdatePipelineRequest,
    public readonly userId: string,
  ) {}
}
