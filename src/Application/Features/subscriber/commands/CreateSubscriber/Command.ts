import { CreateSubscriberRequest } from "../../../../DTOs";

export class CreateSubscriberCommand {
  constructor(
    public readonly data: CreateSubscriberRequest,
    public readonly userId: string,
  ) {}
}
