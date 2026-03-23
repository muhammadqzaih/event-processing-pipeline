export class GetSubscribersByPipelineIdQuery {
  constructor(
    public readonly pipelineId: string,
    public readonly userId: string,
  ) {}
}
