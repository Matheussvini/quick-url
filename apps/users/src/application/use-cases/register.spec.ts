import { compare } from 'bcryptjs';
import { RegisterUseCase } from './resgister';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-alredy-exists-error';
import { PublishUserCreatedUseCase } from './publish-user-created';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';

class PublishUserCreatedUseCaseMock extends PublishUserCreatedUseCase {
  public calledWith: any = null;

  constructor() {
    super({ publish: async () => {} } as any); // simula o messagingAdapter
  }

  async execute(data: any) {
    this.calledWith = data;
  }
}

const userMockInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: '123456',
};

let usersRepository: InMemoryUsersRepository;
let publishUserCreated: PublishUserCreatedUseCaseMock;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    publishUserCreated = new PublishUserCreatedUseCaseMock();
    sut = new RegisterUseCase(usersRepository, publishUserCreated);
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

  it('should to publish user created event upon registration', async () => {
    const { user } = await sut.execute(userMockInput);

    expect(publishUserCreated.calledWith).toEqual(
      expect.objectContaining({
        userId: user.id,
        name: user.name,
      }),
    );
    expect(publishUserCreated.calledWith.userId).toEqual(expect.any(String));
  });

  it('should throw if publishUserCreated fails', async () => {
    // Força o método do publisher a lançar erro
    vi.spyOn(publishUserCreated, 'execute').mockRejectedValueOnce(
      new Error('Kafka is down'),
    );

    await expect(sut.execute(userMockInput)).rejects.toThrowError(
      'Kafka is down',
    );
  });

  it('should not allow to register with same email', async () => {
    await sut.execute(userMockInput);

    await expect(sut.execute(userMockInput)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    );
  });
});
