import fastify from 'fastify';
import { urlsRoutes } from './http/controllers/urls/routes';
import { errorHandler } from './application/use-cases/errors/app-handler-error';
import fastifyJwt from '@fastify/jwt';
import { env } from '@/env';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(urlsRoutes);
app.setErrorHandler(errorHandler);
