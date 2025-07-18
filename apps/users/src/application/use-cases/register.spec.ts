import { compare } from 'bcryptjs';
import { RegisterUseCase } from './resgister';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-alredy-exists-error';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';

const userMockInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '123456',
};

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should to register', async () => {
    const { user } = await sut.execute(userMockInput);

    expect(user.id).toEqual(expect.any(String));
  });

  it('should to hash user password upon registration', async () => {
    const { user } = await sut.execute(userMockInput);

    const isPasswordCorrectlyHashed = await compare(
      userMockInput.password,
      user.password_hash,
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not allow to register with same email', async () => {
    await sut.execute(userMockInput);

    await expect(sut.execute(userMockInput)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    );
  });
});
