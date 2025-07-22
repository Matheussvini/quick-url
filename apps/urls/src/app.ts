import fastify from 'fastify';
import { urlsRoutes } from './http/controllers/urls/routes';
import { errorHandler } from './application/use-cases/errors/app-handler-error';
import fastifyJwt from '@fastify/jwt';
import { env } from '@/env';
import { clicksRoutes } from './http/controllers/clicks/routes';
import { setupSwagger } from './http/plugins/swagger';

export const app = fastify();

(async () => {
  await setupSwagger(app);
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });
  app.register(urlsRoutes);
  app.register(clicksRoutes);
  app.setErrorHandler(errorHandler);
  app.get('/docs', async (request, reply) => {
    return reply.redirect('https://github.com/Matheussvini/quick-url#readme');
  });
})();
