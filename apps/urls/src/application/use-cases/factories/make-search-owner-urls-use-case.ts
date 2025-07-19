import { PrismaOwnersRepository } from '@/application/repositories/prisma/prisma-owners-repository';
import { PrismaUrlsRepository } from '@/application/repositories/prisma/prisma-urls-repository';
import { SearchOwnerUrlsUseCase } from '../search-owner-urls';

export function makeSearchOwnerUrlsUseCase() {
  const ownersRepository = new PrismaOwnersRepository();
  const urlsRepository = new PrismaUrlsRepository();

  return new SearchOwnerUrlsUseCase(ownersRepository, urlsRepository);
}
