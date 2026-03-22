import "reflect-metadata";
import { registerDependencies, container } from  "./DI/container";
import { TOKENS } from "./Domain/tokens";
import { IWorkerService } from "./Application/Contracts/IWorkerService";
import { BullMQQueueService } from "./Infrastructure/services/BullMQQueueService";
import { disconnectPrisma } from "./Infrastructure/database/prisma-client";
import { createQueueWorkers } from "./Infrastructure/worker/createQueueWorkers";
import { setupWorkerEvents } from "./Infrastructure/worker/setupWorkerEvents";
import { setupWorkerShutdown } from "./Infrastructure/worker/setupWorkerShutdown";


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
