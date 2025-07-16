import fastify from 'fastify';
import { usersRoutes } from '@/http/controllers/users/routes';
import { ZodError } from 'zod';
import { env } from '@/env';
import { errorHandler } from './application/use-cases/errors/app-handler-error';

export const app = fastify();
console.log('app created');

app.register(usersRoutes);
app.setErrorHandler(errorHandler);
