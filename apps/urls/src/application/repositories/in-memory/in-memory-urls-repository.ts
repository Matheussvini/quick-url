import { Prisma, Url } from '@prisma/client';
import { UrlsRepository } from '../urls-repository';
import { randomUUID } from 'crypto';

export class InMemoryUrlsRepository implements UrlsRepository {
  private urls: Url[] = [];

  async create(data: Prisma.UrlCreateInput): Promise<Url> {
    const url: Url = {
      id: randomUUID(),
      original_url: data.original_url,
      clicks_count: 0,
      short_code: data.short_code,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      owner_id: data.owner?.connect?.id || null,
    };
    this.urls.push(url);
    return url;
  }

  async findById(id: string): Promise<Url | null> {
    return this.urls.find((url) => url.id === id) || null;
  }

  async findByShortCode(short_code: string): Promise<Url | null> {
    return this.urls.find((url) => url.short_code === short_code) || null;
  }
  async findByOwnerId(owner_id: string): Promise<Url | null> {
    return this.urls.find((url) => url.owner_id === owner_id) || null;
  }
}
