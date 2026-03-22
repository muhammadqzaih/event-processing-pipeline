import { DeliveryStatus, JobDelivery } from "../entities/JobDelivery";


export interface IJobDeliveryRepository {
  create(data: {
    id?: string;
    jobId: string;
    subscriberId: string;
    status?: DeliveryStatus;
    attemptCount?: number;
    lastAttempt?: Date | null;
    responseStatus?: number | null;
    responseBody?: string | null;
  }): Promise<JobDelivery>;

  createMany(data: Array<{
    id?: string;
    jobId: string;
    subscriberId: string;
    status?: DeliveryStatus;
    attemptCount?: number;
    lastAttempt?: Date | null;
    responseStatus?: number | null;
    responseBody?: string | null;
  }>): Promise<void>;

  findByJobId(jobId: string): Promise<JobDelivery[]>;
  findById(id: string): Promise<JobDelivery | null>;

  updateStatus(
    id: string,
    data: {
      status: DeliveryStatus;
      attemptCount?: number;
      lastAttempt?: Date | null;
      responseStatus?: number | null;
      responseBody?: string | null;
    },
  ): Promise<JobDelivery>;

  findPendingByJobId(jobId: string): Promise<JobDelivery[]>;
}
