import { Url } from '@/generated/.prisma/client';
import { UrlsRepository } from '../repositories/urls-repository';
import { OwnersRepository } from '../repositories/owners-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface UpdateUrlUseCaseRequest {
  id: string;
  external_id: string;
  new_url: string;
}

interface UpdateUrlUseCaseResponse {
  updated_url: Url;
}

export class UpdateUrlUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private urlsRepository: UrlsRepository,
  ) {}

  async execute({
    id,
    external_id,
    new_url,
  }: UpdateUrlUseCaseRequest): Promise<UpdateUrlUseCaseResponse> {
    const url = await this.urlsRepository.findById(id);
    if (!url || url.deleted_at) throw new ResourceNotFoundError('URL');

    const owner = await this.ownersRepository.findByExternalId(external_id);
    if (!owner) throw new ResourceNotFoundError('Owner');
    else if (owner.id !== url.owner_id) throw new InvalidCredentialsError();

    const updated_url = await this.urlsRepository.update(id, {
      original_url: new_url,
    });

    return {
      updated_url,
    };
  }
}
