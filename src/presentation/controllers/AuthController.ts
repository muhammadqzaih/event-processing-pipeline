import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../domain/tokens";
import { IMediator } from "../../application/contracts";
import { AuthResponse, LoginRequest, RegisterRequest } from "../../application/DTOs";
import { sendCreated, sendOk } from "../common/http/response";
import { BodyHandler } from "../types/http";
import { RegisterUserCommand } from "../../application/Features/auth/commands/register-user/Command";
import { LoginUserCommand } from "../../application/Features/auth/commands/login-user/Command";

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.Mediator)
    private readonly mediator: IMediator,
  ) {}

  register: BodyHandler<RegisterRequest, AuthResponse> = async (req, res) => {
    const command = new RegisterUserCommand(req.body);
    const result = await this.mediator.send<AuthResponse>(command);
    sendCreated(res, result, "User registered successfully");
  };

  login: BodyHandler<LoginRequest, AuthResponse> = async (req, res) => {
    const command = new LoginUserCommand(req.body);
    const result = await this.mediator.send<AuthResponse>(command);
    sendOk(res, result, "User logged in successfully");
  };
}