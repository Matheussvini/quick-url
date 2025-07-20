import { Url } from '@/generated/.prisma/client';
import { OwnersRepository } from '../repositories/owners-repository';
import { UrlsRepository } from '../repositories/urls-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface SearchOwnerUrlsUseCaseRequest {
  external_id: string;
  query: string;
  page: number;
}

export type FriendlyUrl = Pick<
  Url,
  'id' | 'short_code' | 'original_url' | 'clicks_count'
> & {
  shortened_url?: string;
};

interface SearchOwnerUrlsUseCaseResponse {
  urls: FriendlyUrl[];
}

export class SearchOwnerUrlsUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private urlsRepository: UrlsRepository,
  ) {}

  async execute({
    external_id,
    query,
    page,
  }: SearchOwnerUrlsUseCaseRequest): Promise<SearchOwnerUrlsUseCaseResponse> {
    const owner = await this.ownersRepository.findByExternalId(external_id);
    if (!owner) throw new ResourceNotFoundError('Owner');

    const urls = await this.urlsRepository.searchByOwnerIdAndQuery(
      owner.id,
      query,
      page,
    );

    return {
      urls,
    };
  }
}
