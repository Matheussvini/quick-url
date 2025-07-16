import { UserAlreadyExistsError } from '@/application/use-cases/errors/user-alredy-exists-error';
import { makeRegisterUseCase } from '@/application/use-cases/factories/make-register-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  console.log('init register controller', request.body);
  const registerBodySchema = z.object({
    name: z.string().nonempty(),
    email: z.email(),
    password: z.string().min(6),
  });

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
    console.log('error in register controller', err);
    throw err;
  }
  return reply.status(201).send();
}
