import { inject, injectAll, injectable } from "tsyringe";
import { randomUUID } from "node:crypto";
import { IActionRepository } from "../../../domain/repositories"; 
import { IJobDeliveryRepository } from "../../../domain/repositories"; 
import { IJobRepository } from "../../../domain/repositories"; 
import { ISubscriberRepository } from "../../../domain/repositories"; 
import { DeliveryStatus } from "../../../domain/entities";  
import { TOKENS } from "../../../domain/tokens"; 
import { IWorkerService } from "../../interfaces/IWorkerService"; 
import { AppError } from "../../../shared/AppError"; 
import { config } from "../../../config"; 
import { IActionExecutor } from "../../interfaces/IActionExecutor"; 
import { DeliveryResult, IHttpClient } from "../../interfaces/IHttpClient";
import { IQueueService } from "../../interfaces";

@injectable()
export class WorkerService implements IWorkerService {
  private readonly executorMap: Map<string, IActionExecutor>;

  constructor(
    @inject(TOKENS.JobRepository)
    private readonly jobRepository: IJobRepository,
    @inject(TOKENS.JobDeliveryRepository)
    private readonly jobDeliveryRepository: IJobDeliveryRepository,
    @inject(TOKENS.ActionRepository)
    private readonly actionRepository: IActionRepository,
    @inject(TOKENS.SubscriberRepository)
    private readonly subscriberRepository: ISubscriberRepository,
    @inject(TOKENS.HttpClient)
    private readonly httpClient: IHttpClient,
    @inject(TOKENS.QueueService)
    private readonly queueService: IQueueService,
    @injectAll(TOKENS.ActionExecutor)
    actionExecutors: IActionExecutor[],
  ) {
    this.executorMap = new Map(
      actionExecutors.map((executor) => {
        const supportedType = ["transform", "filter", "enrich"].find((type) => executor.supports(type));
        return [supportedType ?? "", executor] as const;
      }).filter(([type]) => type.length > 0),
    );
  }

  async processJob(jobId: string, pipelineId: string): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (!job || job.pipelineId !== pipelineId) {
      throw AppError.notFound("Job not found");
    }

    await this.jobRepository.updateStatus(jobId, "processing");

    try {
      const actions = (await this.actionRepository.findByPipelineId(pipelineId)).sort(
        (a, b) => a.order - b.order,
      );

      let currentPayload: Record<string, unknown> | null = { ...job.payload };
      for (const action of actions) {
        currentPayload = this.executeAction(action.type, action.config, currentPayload);
        if (!currentPayload) {
          break;
        }
      }

      if (!currentPayload) {
        await this.jobRepository.updateStatus(jobId, "completed", {
          filteredOut: true,
          processedAt: new Date().toISOString(),
        });
        return;
      }

      const subscribers = await this.subscriberRepository.findByPipelineId(pipelineId);

      const deliveryPlans = subscribers.map((subscriber) => ({
        subscriber,
        deliveryId: randomUUID(),
      }));

      await this.jobDeliveryRepository.createMany(
        deliveryPlans.map((plan) => ({
          id: plan.deliveryId,
          jobId,
          subscriberId: plan.subscriber.id,
          status: "pending",
          attemptCount: 0,
        })),
      );

      const concurrency = Math.max(1, config.worker.deliveryConcurrency);
      for (let index = 0; index < deliveryPlans.length; index += concurrency) {
        const batch = deliveryPlans.slice(index, index + concurrency);
        await Promise.all(batch.map(async (plan) => {
          const result = await this.httpClient.post(plan.subscriber.url, currentPayload);
          await this.handleDeliveryResult(plan.deliveryId, result, 1);
        }));
      }

      await this.jobRepository.updateStatus(jobId, "completed", currentPayload);
    } catch (error) {
      await this.jobRepository.updateStatus(jobId, "failed", {
        error: error instanceof Error ? error.message : "Unknown processing error",
      });
      throw error;
    }
  }

  async retryDelivery(deliveryId: string): Promise<void> {
    const delivery = await this.jobDeliveryRepository.findById(deliveryId);
    if (!delivery) {
      throw AppError.notFound("Delivery not found");
    }

    if (delivery.status === "delivered") {
      return;
    }

    const maxAttempts = config.worker.maxRetryAttempts;
    if (delivery.attemptCount >= maxAttempts) {
      await this.jobDeliveryRepository.updateStatus(deliveryId, {
        status: "failed",
        lastAttempt: new Date(),
      });
      return;
    }

    const subscriber = await this.subscriberRepository.findById(delivery.subscriberId);
    if (!subscriber) {
      await this.jobDeliveryRepository.updateStatus(deliveryId, {
        status: "failed",
        attemptCount: delivery.attemptCount,
        lastAttempt: new Date(),
        responseBody: "Subscriber not found",
      });
      return;
    }

    const job = await this.jobRepository.findById(delivery.jobId);
    if (!job) {
      await this.jobDeliveryRepository.updateStatus(deliveryId, {
        status: "failed",
        attemptCount: delivery.attemptCount,
        lastAttempt: new Date(),
        responseBody: "Job not found",
      });
      return;
    }

    const payload = (job.result ?? job.payload) as Record<string, unknown>;
    const nextAttempt = delivery.attemptCount + 1;
    const result = await this.httpClient.post(subscriber.url, payload);

    await this.handleDeliveryResult(deliveryId, result, nextAttempt);
  }

  private executeAction(
    actionType: string,
    actionConfig: Record<string, unknown>,
    payload: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (!payload) {
      return null;
    }

    const executor = this.executorMap.get(actionType)
      ?? Array.from(this.executorMap.values()).find((item) => item.supports(actionType));

    if (!executor) {
      return payload;
    }

    return executor.execute(payload, actionConfig);
  }

  private async handleDeliveryResult(
    deliveryId: string,
    result: DeliveryResult,
    attemptCount: number,
  ): Promise<void> {
    const isSuccess = result.success;
    const maxAttemptsReached = attemptCount >= config.worker.maxRetryAttempts;
    const status: DeliveryStatus = isSuccess
      ? "delivered"
      : maxAttemptsReached
        ? "failed"
        : "pending";

    await this.jobDeliveryRepository.updateStatus(deliveryId, {
      status,
      attemptCount,
      lastAttempt: new Date(),
      responseStatus: result.statusCode,
      responseBody:
        result.body === undefined || result.body === null
          ? null
          : typeof result.body === "string"
            ? result.body
            : JSON.stringify(result.body),
    });

    if (isSuccess) {
      return;
    }

    if (maxAttemptsReached) {
      return;
    }

    const delay = config.worker.retryDelayMs * Math.pow(2, attemptCount);
    await this.queueService.addDeliveryRetry(deliveryId, delay);
  }
}
