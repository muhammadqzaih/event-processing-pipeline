import { injectable, inject } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Pipeline } from "../../domain/entities/Pipeline";
import { IPipelineRepository } from "../../domain/repositories/IPipelineRepository";
import { TOKENS } from "../../domain/tokens";


@injectable()
export class PrismaPipelineRepository implements IPipelineRepository{

  constructor(
    @inject(TOKENS.PrismaClient)
    private prisma: PrismaClient
  ) {}

  async create(data: { name: string; description?: string }): Promise<Pipeline> {
    return this.prisma.pipeline.create({
      data: {
        ...data,
        webhookKey: uuidv4(),
      }
    })
  }

  async findAll(): Promise<Pipeline[]> {
    return this.prisma.pipeline.findMany({
      orderBy: { createdAt: "desc" }
    })
  }

  async findById(id: string): Promise<Pipeline | null> {
    return this.prisma.pipeline.findUnique({
      where: { id }
    })
  }

  

}