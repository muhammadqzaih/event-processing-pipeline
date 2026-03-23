import { injectable, inject } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Pipeline } from "../../Domain/Entities";
import { IPipelineRepository } from "../../Domain/Repositories";
import { TOKENS } from "../../Domain/tokens";
import { AppError } from "../../Common/AppError";


@injectable()
export class PrismaPipelineRepository implements IPipelineRepository{

  constructor(
    @inject(TOKENS.PrismaClient)
    private prisma: PrismaClient
  ) {}

  async create(data: { name: string; description: string | null; userId: string }): Promise<Pipeline> {
    return this.prisma.pipeline.create({
      data: {
        name: data.name,
        description: data.description,
        userId: data.userId,
        webhookKey: uuidv4()
      }
    });
  }

  async findAllByUserId(userId: string): Promise<Pipeline[]> {
    return this.prisma.pipeline.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })
  }

  async findById(id: string): Promise<Pipeline | null> {
    return this.prisma.pipeline.findUnique({
      where: { id }
    })
  }

  async findByIdForUser(id: string, userId: string): Promise<Pipeline | null> {
    return this.prisma.pipeline.findFirst({
      where: { id, userId }
    })
  }

  async update(id: string, userId: string, data: { name?: string; description?: string | null }): Promise<Pipeline> {
    const existing = await this.findByIdForUser(id, userId);
    if (!existing) {
      throw AppError.notFound("Pipeline not found");
    }

    return this.prisma.pipeline.update({ where: { id }, data });
  }
  
  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.findByIdForUser(id, userId);
    if (!existing) {
      throw AppError.notFound("Pipeline not found");
    }

    await this.prisma.pipeline.delete({ where: { id } });
  }
}