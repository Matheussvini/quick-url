import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeSearchOwnerUrlsUseCase } from '@/application/use-cases/factories/make-search-owner-urls-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const searchOwnerUrlsQuerySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

async function handler(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

  const { query = '', page } = searchOwnerUrlsQuerySchema.parse(request.query);

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

const schema = {
  summary: 'Search URLs by owner',
  description: 'Endpoint to search URLs owned by the authenticated user',
  tags: ['Urls'],
  querystring: searchOwnerUrlsQuerySchema,
  response: {
    200: z.object({
      urls: z.array(
        z.object({
          id: z.string(),
          short_code: z.string(),
          original_url: z.string(),
          clicks_count: z.number(),
          shortened_url: z.string().optional(),
        }),
      ),
    }),
    404: z.object({ message: z.string() }).describe('Owner not found'),
  },
  security: [{ bearerAuth: [] }],
};

export const search = { schema, handler };
