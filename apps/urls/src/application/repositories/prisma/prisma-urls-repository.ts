import { Prisma, Url } from '@prisma/client';
import { UrlsRepository } from '../urls-repository';
import { prisma } from '@/lib/prisma';

export class PrismaUrlsRepository implements UrlsRepository {
  findByShortCode(short_code: string): Promise<Url | null> {
    return prisma.url.findUnique({
      where: {
        short_code,
      },
    });
  }
  findById(): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }
  findByExternalId(): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }
  async create(data: Prisma.UrlCreateInput): Promise<Url> {
    const url = await prisma.url.create({
      data,
    });
    return url;
  }
}
