import { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials-error';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeUpdateUrlUseCase } from '@/application/use-cases/factories/make-update-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function updateUrl(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

  const updateUrlParamsSchema = z.object({
    id: z.uuid(),
  });

  const updateUrlBodySchema = z.object({
    new_url: z.url(),
  });

  const { id } = updateUrlParamsSchema.parse(request.params);
  const { new_url } = updateUrlBodySchema.parse(request.body);

  try {
    const updateUrlUseCase = makeUpdateUrlUseCase();
    const { updated_url } = await updateUrlUseCase.execute({
      id,
      external_id,
      new_url,
    });

    return reply.status(200).send({ updated_url });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: err.message,
      });
    } else if (err instanceof InvalidCredentialsError) {
      return reply.status(403).send({
        message: err.message,
      });
    }
    throw err;
  }
}
