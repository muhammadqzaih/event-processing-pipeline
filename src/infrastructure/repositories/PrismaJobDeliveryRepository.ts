import { inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";

import { IJobDeliveryRepository } from "../../domain/repositories/IJobDeliveryRepository";
import { TOKENS } from "../../domain/tokens";
import { DeliveryStatus, JobDelivery } from "../../domain/entities/JobDelivery";

type PrismaDeliveryRecord = {
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
};

@injectable()
export class PrismaJobDeliveryRepository implements IJobDeliveryRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: PrismaClient,
  ) {}

  private toDomain(record: PrismaDeliveryRecord): JobDelivery {
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

  async create(data: {
    jobId: string;
    subscriberId: string;
    status?: DeliveryStatus;
    attemptCount?: number;
    lastAttempt?: Date | null;
    responseStatus?: number | null;
    responseBody?: string | null;
  }): Promise<JobDelivery> {
    const created = await this.prisma.jobDelivery.create({
      data: {
        jobId: data.jobId,
        subscriberId: data.subscriberId,
        status: data.status ?? "pending",
        attemptCount: data.attemptCount ?? 0,
        lastAttempt: data.lastAttempt,
        responseStatus: data.responseStatus,
        responseBody: data.responseBody,
      },
    });

    return this.toDomain(created);
  }

  async findByJobId(jobId: string): Promise<JobDelivery[]> {
    const records = await this.prisma.jobDelivery.findMany({
      where: { jobId },
      orderBy: { createdAt: "asc" },
    });

    return records.map((record) => this.toDomain(record));
  }

  async findById(id: string): Promise<JobDelivery | null> {
    const record = await this.prisma.jobDelivery.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async updateStatus(
    id: string,
    data: {
      status: DeliveryStatus;
      attemptCount?: number;
      lastAttempt?: Date | null;
      responseStatus?: number | null;
      responseBody?: string | null;
    },
  ): Promise<JobDelivery> {
    const updated = await this.prisma.jobDelivery.update({
      where: { id },
      data: {
        status: data.status,
        attemptCount: data.attemptCount,
        lastAttempt: data.lastAttempt,
        responseStatus: data.responseStatus,
        responseBody: data.responseBody,
      },
    });

    return this.toDomain(updated);
  }

  async findPendingByJobId(jobId: string): Promise<JobDelivery[]> {
    const records = await this.prisma.jobDelivery.findMany({
      where: { jobId, status: "pending" },
      orderBy: { createdAt: "asc" },
    });

    return records.map((record) => this.toDomain(record));
  }
}
