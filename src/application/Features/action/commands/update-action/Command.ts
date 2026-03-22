import { UpdateActionRequest } from "../../../../DTOs";

export class UpdateActionCommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateActionRequest,
    public readonly userId: string,
  ) {}
}
