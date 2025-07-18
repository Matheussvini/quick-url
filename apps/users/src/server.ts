import { app } from './app';
import { makeOutboxProcessorUseCase } from './application/use-cases/factories/make-outbox-processor-use-case';
import { env } from './env';
app
  .listen({
    host: '0.0.0.0', // importante para que funcione com outros frontend
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP Server USERS running on port ${env.PORT}!`);

    makeOutboxProcessorUseCase().start(5000);
  });
