import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeShortenUrlUseCase } from '@/application/use-cases/factories/make-shorten-url-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function shortenUrl(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

  const shortenUrlBodySchema = z.object({
    url: z.url(),
  });

  const { url } = shortenUrlBodySchema.parse(request.body);

  try {
    const shortenUrlUseCase = makeShortenUrlUseCase();
    const { short_code } = await shortenUrlUseCase.execute({
      url,
      external_id,
    });

    const baseUrl = request.protocol + '://' + request.hostname;
    const shortUrl = baseUrl + '/' + short_code;

    return reply.status(201).send({ shortUrl });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: 'Owner not found',
      });
    }
    throw err;
  }
}
