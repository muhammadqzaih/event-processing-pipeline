import { injectable, inject } from "tsyringe";
import { Prisma, PrismaClient } from "@prisma/client";
import { TOKENS } from "../../Domain/tokens";
import { IActionRepository } from "../../Domain/Repositories";
import { Action, ActionType } from "../../Domain/Entities";

@injectable()
export class PrismaActionRepository implements IActionRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  private toDomain(prismaAction: { id: string; pipelineId: string; type: string; config: string; order: number; createdAt: Date; updatedAt: Date; }): Action {
    let parsedConfig: Record<string, unknown>;
    try {
      parsedConfig = JSON.parse(prismaAction.config) as Record<string, unknown>;
    } catch {
      parsedConfig = {};
    }

    return {
      id: prismaAction.id,
      pipelineId: prismaAction.pipelineId,
      type: prismaAction.type as ActionType,
      config: parsedConfig,
      order: prismaAction.order,
      createdAt: prismaAction.createdAt,
      updatedAt: prismaAction.updatedAt,
    };
  }

  private isPipelineOrderUniqueConflict(error: unknown): boolean {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return false;
    }

    if (error.code !== "P2002") {
      return false;
    }

    const target = Array.isArray(error.meta?.target) ? error.meta.target : [];
    return (
      (target.includes("pipeline_id") || target.includes("pipelineId"))
      && target.includes("order")
    );
  }

  async create(data: {
    pipelineId: string;
    type: string;
    config: Record<string, unknown>;
    order?: number;
  }): Promise<Action | null> {
    try {
      const created = await this.prisma.action.create({
        data: {
          pipelineId: data.pipelineId,
          type: data.type,
          config: JSON.stringify(data.config ?? {}),
          order: data.order ?? 0,
        },
      });

      return this.toDomain(created);
    } catch (error) {
      if (this.isPipelineOrderUniqueConflict(error)) {
        return null;
      }

      throw error;
    }
  }

  async findByPipelineId(pipelineId: string): Promise<Action[]> {
    const actions = await this.prisma.action.findMany({
      where: { pipelineId },
      orderBy: { order: "asc" },
    });

    return actions.map((a) => this.toDomain(a));
  }

  async findById(id: string): Promise<Action | null> {
    const action = await this.prisma.action.findUnique({ where: { id } });
    return action ? this.toDomain(action) : null;
  }

  async update(
    id: string,
    data: {
      type?: string;
      config?: Record<string, unknown>;
      order?: number;
    },
  ): Promise<Action | null> {
    try {
      const updated = await this.prisma.action.update({
        where: { id },
        data: {
          type: data.type,
          config: data.config !== undefined ? JSON.stringify(data.config) : undefined,
          order: data.order,
        },
      });

      return this.toDomain(updated);
    } catch (error) {
      if (this.isPipelineOrderUniqueConflict(error)) {
        return null;
      }

      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.action.delete({ where: { id } });
  }

  async deleteByPipelineId(pipelineId: string): Promise<void> {
    await this.prisma.action.deleteMany({ where: { pipelineId } });
  }
  
}
