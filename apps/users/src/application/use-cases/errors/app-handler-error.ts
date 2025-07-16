import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { env } from '@/env';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Log to an external tool like DataDog/NewRelic/Sentry
  }

  console.log('reply error handler', error);

  return reply.status(error.statusCode ?? 500).send({
    error: error.name ?? 'Internal server error',
    details: error.message ?? 'An unexpected error occurred.',
  });
}
