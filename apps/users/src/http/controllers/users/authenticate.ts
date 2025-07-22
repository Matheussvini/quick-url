import { InvalidCredentialsError } from '@/application/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/application/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

async function handler(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign({
      sub: user.id,
      name: user.name,
    });

    return reply.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message });
    }
    throw err;
  }
}

const schema = {
  summary: 'Authenticate a user',
  description: 'Endpoint to authenticate a user and return a JWT token',
  tags: ['Users'],
  body: authenticateBodySchema,
  response: {
    200: z.object({ token: z.string() }).describe('Authentication successful'),
    401: z.object({ message: z.string() }).describe('Invalid credentials'),
  },
};

export const authenticate = { schema, handler };
