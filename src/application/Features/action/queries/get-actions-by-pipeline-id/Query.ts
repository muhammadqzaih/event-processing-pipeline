export class GetActionsByPipelineIdQuery {
  constructor(
    public readonly pipelineId: string,
    public readonly userId: string,
  ) {}
}
