import { pathToFileURL } from 'node:url';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { reportRoutes } from './routes/report.js';
import { simulateRoutes } from './routes/simulate.js';
import { createDatabasePool, ensureSchema } from './indexer/db.js';
import { startIndexerSync } from './indexer/sync.js';
import { isAllowedOrigin } from './cors.js';

export async function buildServer(): Promise<ReturnType<typeof Fastify>> {
  const app = Fastify({ logger: true });
  const configuredOrigins = (process.env.WEB_ORIGINS ?? process.env.WEB_ORIGIN ?? 'http://localhost:5173')
    .split(',').map((origin) => origin.trim().replace(/\/$/, '')).filter(Boolean);
  await app.register(cors, {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin, configuredOrigins, process.env.ALLOW_CODESPACES_ORIGINS === 'true')) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  });
  await app.register(healthRoutes);
  await app.register(simulateRoutes);
  await app.register(reportRoutes);
  return app;
}

export async function startServer(): Promise<void> {
  const app = await buildServer();
  const port = Number(process.env.PORT ?? 3001);
  if (process.env.DATABASE_URL) {
    const indexerPool = createDatabasePool();
    void ensureSchema(indexerPool)
      .then(() => startIndexerSync(indexerPool))
      .catch((error: unknown) => console.error('[Indexer] startup failed', error));
  }
  await app.listen({ port, host: '0.0.0.0' });
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  await startServer();
}
