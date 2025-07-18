import { PrismaOwnersRepository } from '@/infra/database/prisma/repositories/prisma-owners-repository';
import { CreateOwnerUseCase } from '../create-owner';

export function makeCreateOwnerUseCase() {
  const ownersRepository = new PrismaOwnersRepository();

  return new CreateOwnerUseCase(ownersRepository);
}
