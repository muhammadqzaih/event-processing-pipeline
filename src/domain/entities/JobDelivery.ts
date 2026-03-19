export type DeliveryStatus = "pending" | "delivered" | "failed";

export interface JobDelivery {
  id: string;
  jobId: string;
  subscriberId: string;
  status: DeliveryStatus;
  attemptCount: number;
  lastAttempt?: Date | null;
  responseStatus?: number | null;
  responseBody?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
