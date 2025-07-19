import { JsonValue } from '@prisma/client/runtime/library';
import { OutboxEventsRepository } from '../outbox-events-repository';
interface InMemoryOutboxEvent {
  id: string;
  event_type: string;
  payload: JsonValue;
  processed: boolean;
  created_at: Date;
  processed_at: Date | null;
}

export class InMemoryOutboxEventsRepository implements OutboxEventsRepository {
  public events: InMemoryOutboxEvent[] = [];

  async findUnprocessed(limit: number) {
    return this.events.filter((event) => !event.processed).slice(0, limit);
  }

  async markProcessed(id: string) {
    const event = this.events.find((event) => event.id === id);
    if (event) {
      event.processed = true;
      event.processed_at = new Date();
    }
  }

  async addEvent(event: InMemoryOutboxEvent) {
    this.events.push(event);
  }
}
