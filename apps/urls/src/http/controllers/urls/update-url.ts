import { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials-error';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { makeUpdateUrlUseCase } from '@/application/use-cases/factories/make-update-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const updateUrlParamsSchema = z.object({
  id: z.uuid(),
});

const updateUrlBodySchema = z.object({
  new_url: z.url(),
});

async function handler(request: FastifyRequest, reply: FastifyReply) {
  const external_id = request.user.sub ?? null;

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
const updateUrlSchema = {
  summary: 'Update a source URL',
  description:
    'Endpoint to update an existing source URL owned by the authenticated user',
  tags: ['Urls'],
  params: updateUrlParamsSchema,
  body: updateUrlBodySchema,
  response: {
    200: z.object({
      updated_url: z.object({
        id: z.string(),
        short_code: z.string(),
        original_url: z.string(),
        clicks_count: z.number(),
      }),
    }),
    403: z.object({ message: z.string() }).describe('Invalid credentials'),
    404: z.object({ message: z.string() }).describe('URL or Owner not found'),
  },
  security: [{ bearerAuth: [] }],
};

export const updateUrl = { schema: updateUrlSchema, handler };
