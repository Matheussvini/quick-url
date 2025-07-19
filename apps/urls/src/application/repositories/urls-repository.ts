import { Prisma, Url } from '@prisma/client';
import { FriendlyUrl } from '../use-cases/search-owner-urls';

export interface UrlsRepository {
  create(data: Prisma.UrlCreateInput): Promise<Url>;
  findById(id: string): Promise<Url | null>;
  findManyByOwnerId(owner_id: string): Promise<Url[] | null>;
  findByShortCode(short_code: string): Promise<Url | null>;
  update(id: string, data: Prisma.UrlUpdateInput): Promise<Url>;
  searchByOwnerIdAndQuery(
    owner_id: string,
    query: string,
    page: number,
  ): Promise<FriendlyUrl[]>;
}
