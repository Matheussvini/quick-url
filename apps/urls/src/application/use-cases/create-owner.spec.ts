import { InMemoryOwnersRepository } from './../repositories/in-memory/in-memory-owners-repository';
import { CreateOwnerUseCase } from './create-owner';
import { expect, describe, it, beforeEach } from 'vitest';
import { OwnerAlreadyExistsError } from './errors/owner-alredy-exists-error';

let ownersRepository = new InMemoryOwnersRepository();
let sut: CreateOwnerUseCase;

describe('Create Owner Use Case', () => {
  beforeEach(() => {
    ownersRepository = new InMemoryOwnersRepository();
    sut = new CreateOwnerUseCase(ownersRepository);
  });

  it('should create an owner', async () => {
    const ownerData = {
      external_id: '123',
      name: 'John Doe',
    };

    const { owner } = await sut.execute(ownerData);

    expect(owner.id).toEqual(expect.any(String));
  });

  it('should not allow to create an owner with the same external_id', async () => {
    const ownerData = {
      external_id: '123',
      name: 'John Doe',
    };

    await sut.execute(ownerData);

    await expect(sut.execute(ownerData)).rejects.toBeInstanceOf(
      OwnerAlreadyExistsError,
    );
  });
});
