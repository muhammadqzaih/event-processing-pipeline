import { LoginRequest } from "../../../../DTOs";

export class LoginUserCommand {
  constructor(public readonly data: LoginRequest) {}
}
