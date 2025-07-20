import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeClickUrlUseCase } from '@/application/use-cases/factories/make-click-url-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function clickUrl(request: FastifyRequest, reply: FastifyReply) {
  const clickUrlParamsSchema = z.object({
    short_code: z.string().max(6),
  });

  const { short_code } = clickUrlParamsSchema.parse(request.params);

  try {
    const clickUrlUseCase = makeClickUrlUseCase();
    const { original_url } = await clickUrlUseCase.execute({ short_code });
    return reply.redirect(original_url);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
