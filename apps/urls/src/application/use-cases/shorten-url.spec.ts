import { expect, describe, it, beforeEach, vi } from 'vitest';
import { ShortenUrlUseCase } from './shorten-url';
import { InMemoryUrlsRepository } from '../repositories/in-memory/in-memory-urls-repository';
import { InMemoryOwnersRepository } from '../repositories/in-memory/in-memory-owners-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let ownersRepository: InMemoryOwnersRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: ShortenUrlUseCase;

type ShortenUrlUseCasePrivate = {
  generateShortCode: () => string;
  generateUniqueShortCode: () => Promise<string>;
};

describe('Shorten URL Use Case', () => {
  beforeEach(() => {
    ownersRepository = new InMemoryOwnersRepository();
    urlsRepository = new InMemoryUrlsRepository();
    sut = new ShortenUrlUseCase(ownersRepository, urlsRepository);
  });

  it('should shorten a URL with an owner', async () => {
    const owner = await ownersRepository.create({
      external_id: 'owner-123',
      name: 'John Doe',
    });

    const { short_code, shortened_url } = await sut.execute({
      url: 'https://example.com',
      external_id: owner.external_id,
    });

    expect(short_code).toEqual(expect.any(String));
    expect(shortened_url.short_code).toBe(short_code);
    expect(shortened_url.owner_id).toBe(owner.id);
  });

  it('should shorten a URL without an owner', async () => {
    const { shortened_url } = await sut.execute({
      url: 'https://example.com',
      external_id: '',
    });

    expect(shortened_url.id).toEqual(expect.any(String));
    expect(shortened_url.owner_id).toBeNull();
  });

  it('should throw if owner does not exist', async () => {
    await expect(() =>
      sut.execute({
        url: 'https://example.com',
        external_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should generate a short code between 1 and 6 characters, alphanumeric', () => {
    const privateSut = sut as unknown as ShortenUrlUseCasePrivate;

    const code = privateSut.generateShortCode();

    expect(code.length).toBeGreaterThanOrEqual(1);
    expect(code.length).toBeLessThanOrEqual(6);
    expect(code).toMatch(/^[A-Za-z0-9]+$/);
  });

  it('should retry generating unique short code if a collision occurs', async () => {
    const privateSut = sut as unknown as ShortenUrlUseCasePrivate;

    const firstCode = 'abc123';
    const secondCode = 'xyz789';

    vi.spyOn(privateSut, 'generateShortCode')
      .mockReturnValueOnce(firstCode)
      .mockReturnValueOnce(secondCode);

    await urlsRepository.create({
      original_url: 'https://already-exists.com',
      short_code: firstCode,
    });

    const uniqueCode = await privateSut.generateUniqueShortCode();

    expect(uniqueCode).toBe(secondCode);
  });
});
