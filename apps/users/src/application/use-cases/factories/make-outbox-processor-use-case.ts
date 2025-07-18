import { PrismaOutboxEventsRepository } from '@/application/repositories/prisma/prisma-outbox-events-repository';
import { OutboxProcessorUseCase } from '../outbox-processor';

export function makeOutboxProcessorUseCase() {
  const outboxRepository = new PrismaOutboxEventsRepository();

  return new OutboxProcessorUseCase(outboxRepository);
}
