import "reflect-metadata";
import { registerDependencies, container } from  "./di/container";
import { TOKENS } from "./domain/tokens";
import { IWorkerService } from "./application/contracts/IWorkerService";
import { BullMQQueueService } from "./infrastructure/services/BullMQQueueService";
import { disconnectPrisma } from "./infrastructure/database/prisma-client";
import { createQueueWorkers } from "./infrastructure/worker/createQueueWorkers";
import { setupWorkerEvents } from "./infrastructure/worker/setupWorkerEvents";
import { setupWorkerShutdown } from "./infrastructure/worker/setupWorkerShutdown";


async function startWorker(): Promise<void> {
  registerDependencies();

  const workerService = container.resolve<IWorkerService>(TOKENS.WorkerService);
  const queueService = container.resolve(BullMQQueueService);
  const { processWorker, retryWorker } = createQueueWorkers(workerService, queueService);
  setupWorkerEvents(processWorker, retryWorker);

  console.log("Worker started: processing and retry queues are active");
  setupWorkerShutdown(processWorker, retryWorker, disconnectPrisma);
}

void startWorker();
