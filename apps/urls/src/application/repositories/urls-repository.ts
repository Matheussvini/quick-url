import { Prisma, Url } from '@prisma/client';

export interface UrlsRepository {
  create(data: Prisma.UrlCreateInput): Promise<Url>;
  findById(id: string): Promise<Url | null>;
  findByOwnerId(owner_id: string): Promise<Url | null>;
  findByShortCode(short_code: string): Promise<Url | null>;
}
