import fastify from 'fastify';
import { usersRoutes } from '@/http/controllers/users/routes';
import { env } from '@/env';
import { errorHandler } from './application/use-cases/errors/app-handler-error';
import fastifyJwt from '@fastify/jwt';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '7d',
  },
});

app.register(usersRoutes);
app.setErrorHandler(errorHandler);
app.get('/doc', async (request, reply) => {
  return reply.redirect('https://github.com/Matheussvini/quick-url#readme');
});
