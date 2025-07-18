import { Owner, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { OwnersRepository } from '@/application/repositories/owners-repositories';

export class PrismaOwnersRepository implements OwnersRepository {
  async create(data: Prisma.OwnerCreateInput): Promise<Owner> {
    const owner = await prisma.owner.create({
      data,
    });
    return owner;
  }
}
