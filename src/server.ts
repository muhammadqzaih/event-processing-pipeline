import 'reflect-metadata';
import { createApp } from './presentation/app';
import { registerDependencies } from './DI/container';
import { disconnectPrisma } from './Infrastructure/database/prisma-client';
import { config } from './Config';


async function start() {
  registerDependencies();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  async function shutdown() {
    console.log('Shutting down server...');

    server.close(async () => {
      await disconnectPrisma();
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start();