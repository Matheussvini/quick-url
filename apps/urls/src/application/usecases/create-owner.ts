import { Owner } from '@prisma/client';
import { OwnersRepository } from '../repositories/owners-repository';

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
    const owner = await this.ownerRepository.create({
      external_id,
      name,
    });

    return {
      owner,
    };
  }
}
