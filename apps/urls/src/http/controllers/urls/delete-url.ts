import { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials-error';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeDeleteUrlUseCase } from '@/application/use-cases/factories/make-delete-url-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function deleteUrl(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

  const deleteUrlParamsSchema = z.object({
    id: z.uuid(),
  });

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
