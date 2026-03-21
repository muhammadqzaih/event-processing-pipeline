import { inject, injectable } from "tsyringe";
import { AuthResponse, LoginRequest, RegisterRequest } from "../dtos";
import { IAuthService, IHashService, ITokenService } from "../interfaces";
import { IUserRepository } from "../../domain/repositories";
import { TOKENS } from "../../domain/tokens";
import { AppError } from "../../shared/AppError";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TOKENS.HashService)
    private readonly hashService: IHashService,
    @inject(TOKENS.TokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async register(dto: RegisterRequest): Promise<AuthResponse> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw AppError.conflict("Email already in use");
    }

    const hashedPassword = await this.hashService.hash(dto.password);
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const token = this.tokenService.generate({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(dto: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const isPasswordValid = await this.hashService.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const token = this.tokenService.generate({
      userId: user.id,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}