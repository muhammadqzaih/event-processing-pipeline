export class GetJobsByPipelineIdQuery {
  constructor(
    public readonly pipelineId: string,
    public readonly userId: string,
  ) {}
}
