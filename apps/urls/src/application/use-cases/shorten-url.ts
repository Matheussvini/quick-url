import { Url } from '@prisma/client';
import { UrlsRepository } from '../repositories/urls-repository';
import { OwnersRepository } from '../repositories/owners-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ShortenUrlUseCaseRequest {
  url: string;
  external_id: string;
}

interface ShortenUrlUseCaseResponse {
  short_code: string;
  shortened_url: Url;
}

export class ShortenUrlUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private urlsRepository: UrlsRepository,
  ) {}

  private generateShortCode(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 6) + 1; // de 1 a 6
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  private async generateUniqueShortCode(): Promise<string> {
    let shortCode: string;
    let exists: Url | null;

    do {
      shortCode = this.generateShortCode();
      exists = await this.urlsRepository.findByShortCode(shortCode);
    } while (exists);

    return shortCode;
  }

  async execute({
    url,
    external_id,
  }: ShortenUrlUseCaseRequest): Promise<ShortenUrlUseCaseResponse> {
    let owner;
    if (external_id) {
      owner = await this.ownersRepository.findByExternalId(external_id);
      if (!owner) throw new ResourceNotFoundError();
    }

    const shortCode = await this.generateUniqueShortCode();

    const shortened_url = await this.urlsRepository.create({
      original_url: url,
      short_code: shortCode,
      owner: owner
        ? {
            connect: {
              id: owner.id,
            },
          }
        : undefined,
    });

    return {
      shortened_url,
      short_code: shortCode,
    };
  }
}
