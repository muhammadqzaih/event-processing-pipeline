import { inject, injectable } from "tsyringe";
import {PrismaClient } from "@prisma/client";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { TOKENS } from "../../domain/tokens";
import { Job, JobStatus } from "../../domain/entities/Job";

type PrismaJobRecord = {
  id: string;
  pipelineId: string;
  payload: string;
  result: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};


@injectable()
export class PrismaJobRepository implements IJobRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}
  private parse(value: string | null): Record<string, unknown> | null {
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  async create(data: {
    pipelineId: string;
    payload: Record<string, unknown>;
    result?: Record<string, unknown> | null;
    status?: JobStatus;
  }): Promise<Job> {
    const job = await this.prisma.job.create({
      data: {
        pipelineId: data.pipelineId,
        payload: JSON.stringify(data.payload ?? {}),
        result: data.result ? JSON.stringify(data.result) : null,
        status: data.status ?? "pending",
      },
    });

    return {
      ...job,
      payload: this.parse(job.payload) ?? {},
      result: this.parse(job.result),
      status: job.status as JobStatus,
    };
  }

}
