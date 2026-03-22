export class DeleteSubscriberCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
