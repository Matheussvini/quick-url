import { Owner, Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';
import { OwnersRepository } from '@/application/repositories/owners-repository';

export class PrismaOwnersRepository implements OwnersRepository {
  findByExternalId(external_id: string): Promise<Owner | null> {
    return prisma.owner.findUnique({
      where: {
        external_id,
      },
    });
  }
  findById(id: string): Promise<Owner | null> {
    return prisma.owner.findUnique({
      where: {
        id,
      },
    });
  }
  async create(data: Prisma.OwnerCreateInput): Promise<Owner> {
    const owner = await prisma.owner.create({
      data,
    });
    return owner;
  }
}
