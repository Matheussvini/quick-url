import { PrismaOwnersRepository } from '@/application/repositories/prisma/prisma-owners-repository';
import { CreateOwnerUseCase } from '../create-owner';

export function makeCreateOwnerUseCase() {
  const ownersRepository = new PrismaOwnersRepository();

  return new CreateOwnerUseCase(ownersRepository);
}
