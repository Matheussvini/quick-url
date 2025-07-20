import { Owner, Prisma } from '@/generated/.prisma/client';

export interface OwnersRepository {
  create(data: Prisma.OwnerCreateInput): Promise<Owner>;
  findByExternalId(external_id: string): Promise<Owner | null>;
  findById(id: string): Promise<Owner | null>;
}
