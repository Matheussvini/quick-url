import { Owner, Prisma } from '@prisma/client';
import { OwnersRepository } from '../owners-repository';
import { randomUUID } from 'crypto';

export class InMemoryOwnersRepository implements OwnersRepository {
  public owners: Owner[] = [];

  async create(data: Prisma.OwnerCreateInput): Promise<Owner> {
    const owner: Owner = {
      id: randomUUID(),
      external_id: data.external_id,
      name: data.name,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.owners.push(owner);
    return owner;
  }

  async findByExternalId(external_id: string): Promise<Owner | null> {
    return (
      this.owners.find((owner) => owner.external_id === external_id) || null
    );
  }

  async findById(id: string): Promise<Owner | null> {
    return this.owners.find((owner) => owner.id === id) || null;
  }
}
