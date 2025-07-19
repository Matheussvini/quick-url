import { PrismaOwnersRepository } from '@/application/repositories/prisma/prisma-owners-repository';
import { PrismaUrlsRepository } from '@/application/repositories/prisma/prisma-urls-repository';
import { UpdateUrlUseCase } from '../update-url';

export function makeUpdateUrlUseCase() {
  const urlsRepository = new PrismaUrlsRepository();
  const ownersRepository = new PrismaOwnersRepository();

  return new UpdateUrlUseCase(ownersRepository, urlsRepository);
}
