import { RegisterRequest } from "../../../../DTOs";


export class RegisterUserCommand {
  constructor(public readonly data: RegisterRequest) {}
}
