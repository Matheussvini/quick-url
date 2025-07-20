import { Prisma, Url } from '@prisma/client';
import { UrlsRepository } from '../urls-repository';
import { randomUUID } from 'crypto';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { FriendlyUrl } from '@/application/use-cases/search-owner-urls';

export class InMemoryUrlsRepository implements UrlsRepository {
  public urls: Url[] = [];

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
    return (
      this.urls.find((url) => url.id === id && url.deleted_at === null) || null
    );
  }

  async findByShortCode(short_code: string): Promise<Url | null> {
    return (
      this.urls.find(
        (url) => url.short_code === short_code && url.deleted_at === null,
      ) || null
    );
  }

  async findManyByOwnerId(owner_id: string): Promise<Url[] | null> {
    const urls = this.urls.filter(
      (url) => url.owner_id === owner_id && url.deleted_at === null,
    );
    return urls.length > 0 ? urls : null;
  }

  async update(id: string, data: Prisma.UrlUpdateInput): Promise<Url> {
    const urlIndex = this.urls.findIndex(
      (url) => url.id === id && url.deleted_at === null,
    );
    if (urlIndex === -1) throw new ResourceNotFoundError('URL');

    const url = this.urls[urlIndex];

    if (data.original_url !== undefined) {
      url.original_url = data.original_url as string;
    }
    if (data.short_code !== undefined) {
      url.short_code = data.short_code as string;
    }
    if (data.clicks_count !== undefined) {
      url.clicks_count = data.clicks_count as number;
    }
    if (data.owner !== undefined && data.owner.connect?.id) {
      url.owner_id = data.owner.connect.id;
    }
    if (data.deleted_at !== undefined) {
      url.deleted_at = data.deleted_at as Date | null;
    }
    url.updated_at = new Date();

    this.urls[urlIndex] = url;
    return url;
  }

  async searchByOwnerIdAndQuery(
    owner_id: string,
    query: string,
    page: number,
  ): Promise<FriendlyUrl[]> {
    const urls = this.urls.filter(
      (url) =>
        url.owner_id === owner_id &&
        url.original_url.toLowerCase().includes(query.toLowerCase()) &&
        url.deleted_at === null,
    );

    const paginatedUrls = urls.slice((page - 1) * 20, page * 20);

    return paginatedUrls.map((url) => ({
      id: url.id,
      short_code: url.short_code,
      original_url: url.original_url,
      clicks_count: url.clicks_count,
    }));
  }
}
