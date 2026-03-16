import { injectable, inject } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { TOKENS } from "../../domain/tokens";
import { ISubscriberRepository } from "../../domain/repositories/ISubscriberRepository";
import { Subscriber } from "../../domain/entities/Subscriber";

@injectable()
export class PrismaSubscriberRepository implements ISubscriberRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  async create(data: { pipelineId: string; url: string; type?: string }): Promise<Subscriber> {
    return await this.prisma.subscriber.create({
      data: {
        pipelineId: data.pipelineId,
        url: data.url,
        type: data.type,
      },
    });
  }

  async findByPipelineId(pipelineId: string): Promise<Subscriber[]> {
    return await this.prisma.subscriber.findMany({
      where: { pipelineId },
      orderBy: { createdAt: "asc" },
    });
  }
}