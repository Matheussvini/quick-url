import { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials-error';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeDeleteUrlUseCase } from '@/application/use-cases/factories/make-delete-url-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const deleteUrlParamsSchema = z.object({
  id: z.uuid(),
});

async function handler(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

  const { id } = deleteUrlParamsSchema.parse(request.params);

  try {
    const deleteUrlUseCase = makeDeleteUrlUseCase();
    await deleteUrlUseCase.execute({ id, external_id });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: err.message,
      });
    } else if (err instanceof InvalidCredentialsError)
      return reply.status(403).send({
        message: err.message,
      });
    throw err;
  }
}

const schema = {
  summary: 'Delete a URL',
  description: 'Endpoint to logically delete a URL by its ID',
  tags: ['Urls'],
  params: deleteUrlParamsSchema,
  response: {
    204: z.void().describe('URL deleted successfully'),
    403: z.object({ message: z.string() }).describe('Invalid credentials'),
    404: z.object({ message: z.string() }).describe('URL or Owner not found'),
  },
  security: [{ bearerAuth: [] }],
};

export const deleteUrl = { schema, handler };
