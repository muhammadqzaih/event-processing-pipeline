import { Worker } from "bullmq";

export function setupWorkerEvents(processWorker: Worker, retryWorker: Worker): void {
  processWorker.on("failed", (job, error) => {
    const id = job?.id ?? "unknown";
    console.error(`[worker] process-job failed (${id}):`, error.message);
  });

  retryWorker.on("failed", (job, error) => {
    const id = job?.id ?? "unknown";
    console.error(`[worker] retry-delivery failed (${id}):`, error.message);
  });
}
