import { ClicksRepository } from '../clicks-repository';

export class InMemoryClicksRepository implements ClicksRepository {
  public clicks: Array<{ shortened_url_id: string; created_at: Date }> = [];
  public urls: Array<{ id: string; clicks_count: number }> = [];

  async postAndIncrementClickCount(urlId: string): Promise<void> {
    const url = this.urls.find((u) => u.id === urlId);
    if (url) {
      url.clicks_count++;
    } else {
      this.urls.push({ id: urlId, clicks_count: 1 });
    }

    this.clicks.push({
      shortened_url_id: urlId,
      created_at: new Date(),
    });
  }
}
