import { CreateActionRequest } from "../../../../DTOs";

export class CreateActionCommand {
  constructor(
    public readonly data: CreateActionRequest,
    public readonly userId: string,
  ) {}
}
