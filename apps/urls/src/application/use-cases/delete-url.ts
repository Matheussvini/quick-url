import { OwnersRepository } from '../repositories/owners-repository';
import { UrlsRepository } from '../repositories/urls-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface DeleteUrlUseCaseRequest {
  id: string;
  external_id: string;
}

export class DeleteUrlUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private urlsRepository: UrlsRepository,
  ) {}

  async execute({ id, external_id }: DeleteUrlUseCaseRequest): Promise<void> {
    const url = await this.urlsRepository.findById(id);
    if (!url || url.deleted_at) throw new ResourceNotFoundError('URL');

    const owner = await this.ownersRepository.findByExternalId(external_id);
    if (!owner) throw new ResourceNotFoundError('Owner');
    else if (owner.id !== url.owner_id) throw new InvalidCredentialsError();

    await this.urlsRepository.update(id, {
      deleted_at: new Date(),
    });
  }
}
