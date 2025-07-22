import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeShortenUrlUseCase } from '@/application/use-cases/factories/make-shorten-url-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const shortenUrlBodySchema = z.object({
  url: z.url(),
});

async function handler(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user?.sub ?? null;

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

const schema = {
  summary: 'Shorten a URL',
  description: 'Endpoint to shorten a given URL',
  tags: ['Urls'],
  body: shortenUrlBodySchema,
  response: {
    201: z.object({
      shortUrl: z.string().describe('Shortened URL'),
    }),
    404: z.object({ message: z.string() }).describe('Owner not found'),
  },
};

export const shortenUrl = { schema, handler };
