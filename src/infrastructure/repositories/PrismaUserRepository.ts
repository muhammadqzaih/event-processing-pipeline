import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { User } from "../../domain/entities";
import { IUserRepository } from "../../domain/repositories";
import { TOKENS } from "../../domain/tokens";

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