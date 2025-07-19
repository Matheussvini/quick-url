import { InMemoryOwnersRepository } from '../repositories/in-memory/in-memory-owners-repository';
import { InMemoryUrlsRepository } from '../repositories/in-memory/in-memory-urls-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { SearchOwnerUrlsUseCase } from './search-owner-urls';
import { expect, describe, it, beforeEach } from 'vitest';

let ownersRepository: InMemoryOwnersRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: SearchOwnerUrlsUseCase;

describe('Search Owner URLs Use Case', () => {
  beforeEach(() => {
    ownersRepository = new InMemoryOwnersRepository();
    urlsRepository = new InMemoryUrlsRepository();
    sut = new SearchOwnerUrlsUseCase(ownersRepository, urlsRepository);
  });

  it('should return URLs for the owner', async () => {
    const owner = await ownersRepository.create({
      external_id: 'owner-123',
      name: 'John Doe',
    });

    await urlsRepository.create({
      original_url: 'https://example.com',
      short_code: 'exmpl',
      owner: {
        connect: {
          id: owner.id,
        },
      },
    });

    const { urls } = await sut.execute({
      external_id: owner.external_id,
      query: '',
      page: 1,
    });

    expect(urls).toHaveLength(1);
    expect(urls[0].original_url).toBe('https://example.com');
    expect(urls[0].clicks_count).toBe(0);
  });

  it('should return an empty array if no URLs are found', async () => {
    const owner = await ownersRepository.create({
      external_id: 'owner-123',
      name: 'John Doe',
    });

    const { urls } = await sut.execute({
      external_id: owner.external_id,
      query: '',
      page: 1,
    });

    expect(urls).toHaveLength(0);
  });

  it('should throw ResourceNotFoundError if owner does not exist', async () => {
    await expect(() =>
      sut.execute({
        external_id: 'non-existent-owner',
        query: '',
        page: 1,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
