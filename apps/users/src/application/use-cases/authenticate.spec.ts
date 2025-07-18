import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { Prisma } from '@prisma/client';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

async function MockUserInput() {
  return {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password_hash: await hash('123456', 6),
  };
}

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create(await MockUserInput());

    const { user } = await sut.execute({
      email: 'jane.doe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'wrong.email@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create(await MockUserInput());

    await expect(
      sut.execute({
        email: 'jane.doe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
