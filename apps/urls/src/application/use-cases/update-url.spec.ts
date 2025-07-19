import { InMemoryOwnersRepository } from '../repositories/in-memory/in-memory-owners-repository';
import { InMemoryUrlsRepository } from '../repositories/in-memory/in-memory-urls-repository';
import { UpdateUrlUseCase } from './update-url';
import { expect, describe, it, beforeEach } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let ownersRepository: InMemoryOwnersRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: UpdateUrlUseCase;

describe('Update URL Use Case', () => {
  beforeEach(() => {
    ownersRepository = new InMemoryOwnersRepository();
    urlsRepository = new InMemoryUrlsRepository();
    sut = new UpdateUrlUseCase(ownersRepository, urlsRepository);
  });

  it('should update an existing URL', async () => {
    const owner = await ownersRepository.create({
      external_id: 'owner-123',
      name: 'John Doe',
    });

    const url = await urlsRepository.create({
      original_url: 'https://example.com',
      short_code: 'exmpl',
      owner: {
        connect: {
          id: owner.id,
        },
      },
    });

    const { updated_url } = await sut.execute({
      id: url.id,
      external_id: owner.external_id,
      new_url: 'https://new-example.com',
    });

    expect(updated_url.original_url).toBe('https://new-example.com');
  });

  it('should throw if URL does not exist', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existent-id',
        external_id: '',
        new_url: 'https://new-example.com',
      }),
    ).rejects.toThrow('Resource not found');
  });

  it('should throw if URL is deleted', async () => {
    const owner = await ownersRepository.create({
      external_id: 'owner-123',
      name: 'John Doe',
    });

    const url = await urlsRepository.create({
      original_url: 'https://example.com',
      short_code: 'exmpl',
      owner: {
        connect: {
          id: owner.id,
        },
      },
    });

    await urlsRepository.update(url.id, {
      deleted_at: new Date(),
    });

    await expect(() =>
      sut.execute({
        id: url.id,
        external_id: owner.external_id,
        new_url: 'https://new-example.com',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw if owner does not exist', async () => {
    const url = await urlsRepository.create({
      original_url: 'https://example.com',
      short_code: 'exmpl',
      owner: {
        connect: {
          id: 'non-existent-owner-id',
        },
      },
    });

    await expect(() =>
      sut.execute({
        id: url.id,
        external_id: 'non-existent-external-id',
        new_url: 'https://new-example.com',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should throw if owner does not match URL owner', async () => {
    const owner1 = await ownersRepository.create({
      external_id: 'owner-123',
      name: 'John Doe',
    });

    const owner2 = await ownersRepository.create({
      external_id: 'owner-456',
      name: 'Jane Doe',
    });

    const url = await urlsRepository.create({
      original_url: 'https://example.com',
      short_code: 'exmpl',
      owner: {
        connect: {
          id: owner1.id,
        },
      },
    });

    await expect(() =>
      sut.execute({
        id: url.id,
        external_id: owner2.external_id,
        new_url: 'https://new-example.com',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
