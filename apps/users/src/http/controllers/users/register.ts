import { UserAlreadyExistsError } from '@/application/use-cases/errors/user-alredy-exists-error';
import { makeRegisterUseCase } from '@/application/use-cases/factories/make-register-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

const registerBodySchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().min(6),
});

async function handler(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
  return reply.status(201).send('User registered successfully');
}

const schema = {
  summary: 'Register a new user',
  description: 'Endpoint to register a new user in the system',
  tags: ['Users'],
  body: registerBodySchema,
  response: {
    201: z.string().describe('User registered successfully'),
    409: z.object({ message: z.string() }),
  },
};

export const register = { schema, handler };
