import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../../../Domain/tokens";
import { IUserRepository } from "../../../../../Domain/Repositories";
import { IHashService, ITokenService } from "../../../../Contracts";
import { AuthResponse } from "../../../../DTOs";
import { RegisterUserCommand } from "./Command";
import { AppError } from "../../../../../Common/AppError";


@injectable()
export class RegisterUserHandler {
  constructor(
    @inject(TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TOKENS.HashService)
    private readonly hashService: IHashService,
    @inject(TOKENS.TokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<AuthResponse> {
    const { data } = command;
    const existing = await this.userRepository.findByEmail(data.email);

    if (existing) {
      throw AppError.conflict("Email already in use");
    }

    const hashedPassword = await this.hashService.hash(data.password);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
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
}
