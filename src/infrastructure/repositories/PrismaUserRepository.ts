import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { User } from "../../Domain/Entities";
import { IUserRepository } from "../../Domain/Repositories";
import { TOKENS } from "../../Domain/tokens";

@injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}