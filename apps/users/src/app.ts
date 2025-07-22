import fastify from 'fastify';
import { usersRoutes } from '@/http/controllers/users/routes';
import { env } from '@/env';
import { errorHandler } from './application/use-cases/errors/app-handler-error';
import fastifyJwt from '@fastify/jwt';
import { setupSwagger } from './http/plugins/swagger';

export const app = fastify();

(async () => {
  await setupSwagger(app);

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '7d',
    },
  });
  app.register(usersRoutes);
  app.setErrorHandler(errorHandler);
  app.get('/docs', async (request, reply) => {
    return reply.redirect('https://github.com/Matheussvini/quick-url#readme');
  });
})();
