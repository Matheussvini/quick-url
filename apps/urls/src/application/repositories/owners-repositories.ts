import { Owner, Prisma } from '@prisma/client';

export interface OwnersRepository {
  create(data: Prisma.OwnerCreateInput): Promise<Owner>;
}
