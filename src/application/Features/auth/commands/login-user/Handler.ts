import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../domain/tokens";
import { IUserRepository } from "../../../../../domain/repositories";
import { IHashService, ITokenService } from "../../../../contracts";
import { AuthResponse } from "../../../../DTOs";
import { LoginUserCommand } from "./Command";
import { AppError } from "../../../../../common/AppError";


@injectable()
export class LoginUserHandler {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TOKENS.HashService)
    private readonly hashService: IHashService,
    @inject(TOKENS.TokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<AuthResponse> {
    const { data } = command;
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const isPasswordValid = await this.hashService.compare(data.password, user.password);

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
