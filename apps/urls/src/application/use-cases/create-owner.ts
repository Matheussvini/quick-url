import { Owner } from '@/generated/.prisma/client';
import { OwnersRepository } from '../repositories/owners-repository';
import { OwnerAlreadyExistsError } from './errors/owner-alredy-exists-error';

interface CreateOwnerUseCaseRequest {
  external_id: string;
  name: string;
}

interface CreateOwnerUseCaseResponse {
  owner: Owner;
}

export class CreateOwnerUseCase {
  constructor(private ownerRepository: OwnersRepository) {}

  async execute({
    external_id,
    name,
  }: CreateOwnerUseCaseRequest): Promise<CreateOwnerUseCaseResponse> {
    const existingOwner =
      await this.ownerRepository.findByExternalId(external_id);
    if (existingOwner) throw new OwnerAlreadyExistsError();

    const owner = await this.ownerRepository.create({
      external_id,
      name,
    });

    return {
      owner,
    };
  }
}
