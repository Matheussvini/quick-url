import { OutboxEvent } from '@prisma/client';

export interface OutboxEventsRepository {
  findUnprocessed(limit: number): Promise<OutboxEvent[]>;
  markProcessed(id: string): Promise<void>;
}
