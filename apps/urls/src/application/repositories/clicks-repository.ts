export interface ClicksRepository {
  postAndIncrementClickCount(urlId: string): Promise<void>;
}
