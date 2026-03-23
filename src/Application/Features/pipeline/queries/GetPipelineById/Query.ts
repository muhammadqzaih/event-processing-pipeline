export class GetPipelineByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
