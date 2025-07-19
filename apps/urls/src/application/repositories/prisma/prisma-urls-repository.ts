import { Prisma, Url } from '@prisma/client';
import { UrlsRepository } from '../urls-repository';
import { prisma } from '@/lib/prisma';

export class PrismaUrlsRepository implements UrlsRepository {
  async findManyByOwnerId(owner_id: string): Promise<Url[] | null> {
    const urls = await prisma.url.findMany({
      where: { owner_id, deleted_at: null },
    });
    return urls.length ? urls : null;
  }

  async update(id: string, data: Prisma.UrlUpdateInput): Promise<Url> {
    const url = await prisma.url.update({
      where: { id, deleted_at: null },
      data,
    });
    return url;
  }

  findByShortCode(short_code: string): Promise<Url | null> {
    return prisma.url.findUnique({
      where: {
        short_code,
        deleted_at: null,
      },
    });
  }

  async findById(id: string): Promise<Url | null> {
    return prisma.url.findUnique({
      where: { id, deleted_at: null },
    });
  }

  async create(data: Prisma.UrlCreateInput): Promise<Url> {
    const url = await prisma.url.create({
      data,
    });
    return url;
  }
}
