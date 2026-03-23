export class DeleteActionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
