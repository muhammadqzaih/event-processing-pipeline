export class GetJobByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
