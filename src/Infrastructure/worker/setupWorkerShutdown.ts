import { Worker } from "bullmq";

export function setupWorkerShutdown(
  processWorker: Worker,
  retryWorker: Worker,
  onShutdown: () => Promise<void>,
): void {
  let shuttingDown = false;

  const shutdown = async () => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log("Shutting down worker...");

    await Promise.all([processWorker.close(), retryWorker.close()]);
    await onShutdown();

    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown();
  });
  process.on("SIGTERM", () => {
    void shutdown();
  });
}
