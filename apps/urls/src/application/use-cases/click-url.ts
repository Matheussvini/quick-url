import { ClicksRepository } from '../repositories/clicks-repository';
import { UrlsRepository } from '../repositories/urls-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ClickUrlUseCaseRequest {
  short_code: string;
}

interface ClickUrlUseCaseResponse {
  original_url: string;
}

export class ClickUrlUseCase {
  constructor(
    private clicksRepository: ClicksRepository,
    private urlsRepository: UrlsRepository,
  ) {}

  async execute({
    short_code,
  }: ClickUrlUseCaseRequest): Promise<ClickUrlUseCaseResponse> {
    const url = await this.urlsRepository.findByShortCode(short_code);
    if (!url) throw new ResourceNotFoundError('URL');

    await this.clicksRepository.postAndIncrementClickCount(url.id);

    return {
      original_url: url.original_url,
    };
  }
}
