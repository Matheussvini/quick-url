import { makeShortenUrlUseCase } from '@/application/usecases/factories/make-shorten-url-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function shortenUrl(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

  const shortenUrlBodySchema = z.object({
    url: z.string().url(),
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
    throw err;
  }
}
