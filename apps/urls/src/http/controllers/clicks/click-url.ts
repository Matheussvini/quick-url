import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeClickUrlUseCase } from '@/application/use-cases/factories/make-click-url-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const clickUrlParamsSchema = z.object({
  short_code: z.string().max(6),
});

async function handler(request: FastifyRequest, reply: FastifyReply) {
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

const schema = {
  summary: 'Access shortened URL, be redirected and register click',
  description:
    'Endpoint to access a shortened URL, be redirected to the original URL, and register the click',
  tags: ['Clicks'],
  params: clickUrlParamsSchema,
  response: {
    302: z.object({}).describe('Redirects to the original URL'),
    404: z.object({ message: z.string() }).describe('Shortened URL not found'),
  },
};

export const clickUrl = { schema, handler };
