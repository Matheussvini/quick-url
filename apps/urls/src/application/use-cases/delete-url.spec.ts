import { InMemoryOwnersRepository } from '../repositories/in-memory/in-memory-owners-repository';
import { InMemoryUrlsRepository } from '../repositories/in-memory/in-memory-urls-repository';
import { expect, describe, it, beforeEach } from 'vitest';
import { DeleteUrlUseCase } from './delete-url';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let ownersRepository: InMemoryOwnersRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: DeleteUrlUseCase;

describe('Delete URL Use Case', () => {
  beforeEach(() => {
    ownersRepository = new InMemoryOwnersRepository();
    urlsRepository = new InMemoryUrlsRepository();
    sut = new DeleteUrlUseCase(ownersRepository, urlsRepository);
  });

  it('should delete an existing URL', async () => {
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

    await sut.execute({
      id: url.id,
      external_id: owner.external_id,
    });

    const deletedUrl = await urlsRepository.findById(url.id);
    expect(deletedUrl).toBeNull();
  });

  it('should throw if URL does not exist', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existent-id',
        external_id: '',
      }),
    ).rejects.toThrow(ResourceNotFoundError);
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
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
