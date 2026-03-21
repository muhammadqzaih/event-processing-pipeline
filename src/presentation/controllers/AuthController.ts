import { inject, injectable } from "tsyringe";
import { IAuthService } from "../../application/interfaces";
import { TOKENS } from "../../domain/tokens";
import { AuthResponse, LoginRequest, RegisterRequest } from "../../application/dtos";
import { sendCreated, sendOk } from "../../shared/http/response";
import { BodyHandler } from "../types/http";

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.AuthService)
    private readonly authService: IAuthService,
  ) {}

  register: BodyHandler<RegisterRequest, AuthResponse> = async (req, res) => {
    const result = await this.authService.register(req.body);
    sendCreated(res, result, "User registered successfully");
  };

  login: BodyHandler<LoginRequest, AuthResponse> = async (req, res) => {
    const result = await this.authService.login(req.body);
    sendOk(res, result, "User logged in successfully");
  };
}