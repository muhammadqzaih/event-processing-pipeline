export class DeletePipelineCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
