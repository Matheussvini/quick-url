import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';
import { env } from '@/env';
import { UserAlreadyExistsError } from './user-alredy-exists-error';
import { InvalidCredentialsError } from './invalid-credentials-error';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      error: 'Request Validation Error',
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: error.validation, // detalhes do erro já formatados
      method: request.method,
      url: request.url,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: error.cause.issues,
      method: error.method,
      url: error.url,
    });
  }

  // Seus erros customizados:
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(401).send({ message: error.message });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: enviar para monitoramento externo
  }

  return reply.status(error.statusCode ?? 500).send({
    error: error.name ?? 'Internal server error',
    details: error.message ?? 'An unexpected error occurred.',
  });
}
