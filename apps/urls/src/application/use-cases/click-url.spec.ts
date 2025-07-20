import { InMemoryClicksRepository } from "../repositories/in-memory/in-memory-clicks-repository";
import { InMemoryUrlsRepository } from "../repositories/in-memory/in-memory-urls-repository";
import { ClickUrlUseCase } from "./click-url";
import { expect, describe, it, beforeEach } from 'vitest';
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let clicksRepository: InMemoryClicksRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: ClickUrlUseCase;

describe('Click URL Use Case', () => {
  beforeEach(() => {
    clicksRepository = new InMemoryClicksRepository();
    urlsRepository = new InMemoryUrlsRepository();
    sut = new ClickUrlUseCase(clicksRepository, urlsRepository);
  });

  it('should increment clicks and return the original URL', async () => {
    const url = await urlsRepository.create({
      original_url: 'https://example.com',
      short_code: 'exmpl',
      owner: {
        connect: {
          id: 'owner-1',
        },
      },
    });

    clicksRepository.urls.push({ id: url.id, clicks_count: url.clicks_count });

    const response = await sut.execute({ short_code: url.short_code });

    expect(response.original_url).toBe('https://example.com');

    const clickCount = clicksRepository.urls.find(u => u.id === url.id)?.clicks_count;
    expect(clickCount).toBe(1);

    expect(clicksRepository.clicks).toHaveLength(1);
    expect(clicksRepository.clicks[0].shortened_url_id).toBe(url.id);
  });

  it('should throw if short_code does not exist', async () => {
    await expect(() => sut.execute({ short_code: 'nonexistent' }))
      .rejects
      .toBeInstanceOf(ResourceNotFoundError);
  });
});
