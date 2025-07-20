import { PrismaClicksRepository } from '@/application/repositories/prisma/prisma-clicks-repository';
import { PrismaUrlsRepository } from '@/application/repositories/prisma/prisma-urls-repository';
import { ClickUrlUseCase } from '../click-url';

export function makeClickUrlUseCase() {
  const clicksRepository = new PrismaClicksRepository();
  const urlsRepository = new PrismaUrlsRepository();

  return new ClickUrlUseCase(clicksRepository, urlsRepository);
}
