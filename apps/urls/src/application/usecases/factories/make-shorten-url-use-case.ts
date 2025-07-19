import { PrismaOwnersRepository } from '@/application/repositories/prisma/prisma-owners-repository';
import { ShortenUrlUseCase } from '../shorten-url';
import { PrismaUrlsRepository } from '@/application/repositories/prisma/prisma-urls-repository';

export function makeShortenUrlUseCase() {
  const ownersRepository = new PrismaOwnersRepository();
  const urlsRepository = new PrismaUrlsRepository();

  return new ShortenUrlUseCase(ownersRepository, urlsRepository);
}
