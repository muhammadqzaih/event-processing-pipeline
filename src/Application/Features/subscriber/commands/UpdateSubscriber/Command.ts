import { UpdateSubscriberRequest } from "../../../../DTOs";

export class UpdateSubscriberCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateSubscriberRequest,
    public readonly userId: string,
  ) {}
}
