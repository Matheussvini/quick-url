import { PrismaOwnersRepository } from '@/application/repositories/prisma/prisma-owners-repository';
import { PrismaUrlsRepository } from '@/application/repositories/prisma/prisma-urls-repository';
import { DeleteUrlUseCase } from '../delete-url';

export function makeDeleteUrlUseCase() {
  const ownersRepository = new PrismaOwnersRepository();
  const urlsRepository = new PrismaUrlsRepository();

  return new DeleteUrlUseCase(ownersRepository, urlsRepository);
}
