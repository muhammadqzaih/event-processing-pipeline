import { inject, injectable } from "tsyringe";
import {PrismaClient } from "@prisma/client";
import { IJobRepository } from "../../Domain/Repositories";
import { TOKENS } from "../../Domain/tokens";
import { Job, JobStatus } from "../../Domain/Entities";
import { DeliveryStatus, JobDelivery } from "../../Domain/Entities";

type PrismaJobRecord = {
  id: string;
  pipelineId: string;
  payload: string;
  result: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

  type PrismaJobWithDeliveriesRecord = PrismaJobRecord & {
    deliveries: Array<{
      id: string;
      jobId: string;
      subscriberId: string;
      status: string;
      attemptCount: number;
      lastAttempt: Date | null;
      responseStatus: number | null;
      responseBody: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
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

  async findByPipelineId(pipelineId: string): Promise<Job[]> {
    const records = await this.prisma.job.findMany({
      where: { pipelineId },
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => this.toDomain(record));
  }

  async findById(id: string): Promise<Job | null> {
    const record = await this.prisma.job.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }
  
  private parseJson(value: string | null): Record<string, unknown> | null {
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  

  async findByIdWithDeliveries(id: string): Promise<(Job & { deliveries: JobDelivery[] }) | null> {
    const record = await this.prisma.job.findUnique({
      where: { id },
      include: {
        deliveries: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!record) {
      return null;
    }

    const typedRecord = record as PrismaJobWithDeliveriesRecord;

    return {
      ...this.toDomain(typedRecord),
      deliveries: typedRecord.deliveries.map((delivery) => this.toDeliveryDomain(delivery)),
    };
  }

    private toDomain(record: PrismaJobRecord): Job {
    return {
      id: record.id,
      pipelineId: record.pipelineId,
      payload: this.parseJson(record.payload) ?? {},
      result: this.parseJson(record.result),
      status: record.status as JobStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private toDeliveryDomain(record: PrismaJobWithDeliveriesRecord["deliveries"][number]): JobDelivery {
    return {
      id: record.id,
      jobId: record.jobId,
      subscriberId: record.subscriberId,
      status: record.status as DeliveryStatus,
      attemptCount: record.attemptCount,
      lastAttempt: record.lastAttempt,
      responseStatus: record.responseStatus,
      responseBody: record.responseBody,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    result?: Record<string, unknown> | null,
  ): Promise<Job> {
    const updated = await this.prisma.job.update({
      where: { id },
      data: {
        status,
        result: result !== undefined ? JSON.stringify(result) : undefined,
      },
    });

    return this.toDomain(updated);
  }
}
