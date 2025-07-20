import { OutboxEvent } from '@/generated/.prisma/client';

export interface OutboxEventsRepository {
  findUnprocessed(limit: number): Promise<OutboxEvent[]>;
  markProcessed(id: string): Promise<void>;
}
