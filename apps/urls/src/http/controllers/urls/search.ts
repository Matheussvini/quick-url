import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeSearchOwnerUrlsUseCase } from '@/application/use-cases/factories/make-search-owner-urls-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

  const searchOwnerUrlsQuerySchema = z.object({
    query: z.string().default(''),
    page: z.coerce.number().int().min(1).default(1),
  });

  const { query, page } = searchOwnerUrlsQuerySchema.parse(request.query);

  try {
    const searchOwnerUrlsUseCase = makeSearchOwnerUrlsUseCase();
    const { urls } = await searchOwnerUrlsUseCase.execute({
      external_id,
      query,
      page,
    });

    const baseUrl = request.protocol + '://' + request.hostname;
    urls.forEach((url) => {
      url.shortened_url = baseUrl + '/' + url.short_code;
    });

    return reply.status(200).send({ urls });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: err.message,
      });
    }
    throw err;
  }
}
