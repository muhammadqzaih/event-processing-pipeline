import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../Domain/tokens";
import { IMediator } from "../../Application/Contracts";
import { AuthResponse, LoginRequest, RegisterRequest } from "../../Application/DTOs";
import { sendCreated, sendOk } from "../Common/http/response";
import { BodyHandler } from "../Common/http/http";
import { RegisterUserCommand } from "../../Application/Features/auth/commands/RegisterUser/Command";
import { LoginUserCommand } from "../../Application/Features/auth/commands/LoginUser/Command";

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